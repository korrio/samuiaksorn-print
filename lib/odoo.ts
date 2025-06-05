import axios from 'axios';

interface OdooConfig {
  host: string;
  db: string;
  username: string;
  password: string;
}

export class OdooClient {
  private host: string;
  private db: string;
  private username: string;
  private password: string;
  private uid: number | null;
  private sessionId: string | null;
  private isAuthenticated: boolean;
  private apiBase: string;

  constructor(config: OdooConfig) {
    this.host = config.host;
    this.db = config.db;
    this.username = config.username;
    this.password = config.password;
    this.uid = null;
    this.sessionId = null;
    this.isAuthenticated = false;
    this.apiBase = `${this.host}/web`;
  }

  async authenticate(): Promise<boolean> {
    try {
      const response = await axios.post(`${this.apiBase}/session/authenticate`, {
        jsonrpc: '2.0',
        params: {
          db: this.db,
          login: this.username,
          password: this.password
        }
      });

      if (response.data.result) {
        this.uid = response.data.result.uid;
        this.sessionId = response.headers['set-cookie']
          ?.find(cookie => cookie.startsWith('session_id'))
          ?.split(';')[0];
        
        this.isAuthenticated = !!this.uid;
        return this.isAuthenticated;
      }
      return false;
    } catch (error) {
      console.error('Authentication failed:', error);
      return false;
    }
  }

  private getRequestConfig() {
    return {
      headers: {
        'Content-Type': 'application/json',
        'Cookie': this.sessionId
      }
    };
  }

  async callKw(model: string, method: string, args: any[] = [], kwargs: any = {}) {
    if (!this.isAuthenticated) {
      await this.authenticate();
    }

    try {
      const response = await axios.post(
        `${this.apiBase}/dataset/call_kw`,
        {
          jsonrpc: '2.0',
          method: 'call',
          params: {
            model,
            method,
            args,
            kwargs
          }
        },
        this.getRequestConfig()
      );

      if (response.data.error) {
        throw new Error(response.data.error.data.message || 'Unknown error');
      }

      return response.data.result;
    } catch (error) {
      console.error(`Error calling ${model}.${method}:`, error);
      throw error;
    }
  }

  async read(model: string, ids: number[], fields: string[] = []) {
    return this.callKw(model, 'read', [ids, fields]);
  }

  async search(model: string, domain: any[] = [], options: any = {}) {
    return this.callKw(model, 'search', [domain], options);
  }

  async searchRead(model: string, domain: any[] = [], fields: string[] = [], options: any = {}) {
    return this.callKw(model, 'search_read', [domain, fields], options);
  }

  async create(model: string, values: any) {
    return this.callKw(model, 'create', [values]);
  }

  async write(model: string, ids: number[], values: any) {
    return this.callKw(model, 'write', [ids, values]);
  }

  async unlink(model: string, ids: number[]) {
    return this.callKw(model, 'unlink', [ids]);
  }
} 