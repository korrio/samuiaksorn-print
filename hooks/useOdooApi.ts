import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

/**
 * Custom React hook for interacting with Odoo 16 API
 * @param {string} baseUrl - Base URL of your Odoo instance (e.g., 'https://yourodoo.com')
 * @param {string} db - Database name
 * @param {string} username - Username for authentication
 * @param {string} password - Password for authentication
 * @returns {Object} Object with authentication state and API methods
 */
const useOdooApi = (baseUrl, db, username, password) => {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Create axios instance with base configuration
  const api = axios.create({
    baseURL: baseUrl,
    headers: {
        'sec-ch-ua-platform': '"macOS"',
                'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/129.0.0.0 Safari/537.36',
      'Content-Type': 'application/json',
      'X-Openerp-Session-Id': 'fb71a4c358173d4774f5eefc6432fb9fb3e90015'
    },
    // We'll handle credentials differently to avoid CORS issues
    withCredentials: true,
  });

  // Authenticate with Odoo
  const authenticate = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      // const response = await api.post('/web/session/authenticate', {
      //   jsonrpc: '2.0',
      //   params: {
      //     db,
      //     login: username,
      //     password,
      //   },
      // });
      
      // if (response.data.error) {
      //   throw new Error(response.data.error.message || 'Authentication failed');
      // }
      
      // // Store the session data
      // const sessionData = response.data.result;
      
      // // Check if authentication was successful by verifying uid exists
      // if (!sessionData || !sessionData.uid) {
      //   throw new Error('Authentication failed: No user ID returned');
      // }
      
      // setSession(sessionData);

        const sessionData = {
            uid: 8,
            session_id: "fb71a4c358173d4774f5eefc6432fb9fb3e90015"
        }

        setSession(sessionData);
      
      // Instead of relying on cookies, use the session_id in request headers if available
      // Note: Modern Odoo might not return session_id directly, but authentication still works
      //if (sessionData.session_id) {
        api.defaults.headers.common['X-Openerp-Session-Id'] = sessionData.session_id;
        // api.defaults.headers.common['X-Openerp-Session-Id'] = `ae570b04f13ce2e69e186f07d2f916a97a84b585`;
        
      //}
      
      return sessionData;
    } catch (err) {
      const errorMessage = err.response?.data?.error?.message || err.message || 'Authentication failed';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [api, db, username, password]);

  // Call Odoo RPC method
  const callKw = useCallback(async (model, method, args = [], kwargs = {}) => {
    if (!session || !session.uid) {
      throw new Error('Not authenticated. Call authenticate() first');
    }
    
    setLoading(true);
    setError(null);
    
    try {

        let config = {
  method: 'post',
  maxBodyLength: Infinity,
  withCredentials: true,
  url: `http://localhost:3001/odoo/web/dataset/call_kw`,
  headers: { 
    'sec-ch-ua-platform': '"macOS"',
                'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/129.0.0.0 Safari/537.36',
    'X-Openerp-Session-Id': 'fb71a4c358173d4774f5eefc6432fb9fb3e90015', 
    'Content-Type': 'application/json', 
    'Cookie': 'session_id=fb71a4c358173d4774f5eefc6432fb9fb3e90015; HttpOnly; Path=/; Max-Age=604800; Expires=Tue, 29 Apr 2025 05:53:22 GMT'
  },
  data : {
        jsonrpc: '2.0',
        params: {
          model,
          method,
          args,
          kwargs,
        },
      }
};

const response = await axios.request(config)


      // const response = await api.post('/web/dataset/call_kw', {
      //   jsonrpc: '2.0',
      //   params: {
      //     model,
      //     method,
      //     args,
      //     kwargs,
      //   },
      // });
      
      if (response.data.error) {
        throw new Error(response.data.error.message || 'API call failed');
      }
      
      return response.data.result;
    } catch (err) {
      const errorMessage = err.response?.data?.error?.message || err.message || 'API call failed';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [api, session]);

  // Search records
  const search = useCallback(async (model, domain = [], kwargs = {}) => {
    return callKw(model, 'search', [domain], kwargs);
  }, [callKw]);

  // Search and read records
  const searchRead = useCallback(async (model, domain = [], fields = [], kwargs = {}) => {
    return callKw(model, 'search_read', [domain, fields], kwargs);
  }, [callKw]);

  // Read records by IDs
  const read = useCallback(async (model, ids, fields = [], kwargs = {}) => {
    const finalKwargs = fields.length > 0 ? { ...kwargs, fields } : kwargs;
    return callKw(model, 'read', [ids], finalKwargs);
  }, [callKw]);

  // Create a record
  const create = useCallback(async (model, values, kwargs = {}) => {
    return callKw(model, 'create', [values], kwargs);
  }, [callKw]);

  // Update a record
  const write = useCallback(async (model, ids, values, kwargs = {}) => {
    return callKw(model, 'write', [ids, values], kwargs);
  }, [callKw]);

  // Delete records
  const unlink = useCallback(async (model, ids, kwargs = {}) => {
    return callKw(model, 'unlink', [ids], kwargs);
  }, [callKw]);

  // Authenticate automatically on hook mount only if not already authenticated
  useEffect(() => {
    if (baseUrl && db && username && password && !session) {
      authenticate().catch(err => console.error('Auto-authentication failed:', err));
    }
  }, [baseUrl, db, username, password, authenticate, session]);

  return {
    isAuthenticated: !!session,
    user: session?.uid ? { id: session.uid, name: session.username } : null,
    session,
    loading,
    error,
    authenticate,
    callKw,
    search,
    searchRead,
    read,
    create,
    write,
    unlink,
  };
};

export default useOdooApi;