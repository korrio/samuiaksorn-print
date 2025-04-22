"use client";

import React, { useState, useEffect } from 'react';
import useOdooApi from '@/hooks/useOdooApi';

const OdooCrmLeads = () => {
  // Use your proxy URL and Odoo credentials
  const {
    isAuthenticated,
    loading,
    error,
    session,
    searchRead,
    authenticate
  } = useOdooApi(
    'http://localhost:3001/odoo',  // Your proxy URL
    'me16',                        // Your database name
    'samuiaksorn@gmail.com',       // Your username
    'samuiaksorn'                // Your password
  );
  
  const [leads, setLeads] = useState([]);
  const [fetchStatus, setFetchStatus] = useState({ loading: false, error: null });
  
  // Function to fetch leads
  const fetchLeads = async () => {
    if (!isAuthenticated) {
      console.log("Not authenticated yet");
      return;
    }
    
    setFetchStatus({ loading: true, error: null });
    
    try {
      console.log("Fetching leads...");
      // Search for the most recent leads (adjust domain as needed)
      const result = await searchRead(
        'crm.lead',         // Model
        [['active', '=', true]], // Domain filter
        [                   // Fields to fetch
          'name',
          'partner_name',
          'email_from',
          'phone',
          'stage_id',
          'create_date',
          'expected_revenue',
          'probability'
        ],
        { limit: 10, order: 'create_date desc' } // Additional parameters
      );
      
      console.log("Leads fetched:", result);
      setLeads(result || []);
      setFetchStatus({ loading: false, error: null });
    } catch (err) {
      console.error("Error fetching leads:", err);
      setFetchStatus({ loading: false, error: err.message });
    }
  };
  
  // Effect to fetch leads when authenticated
  useEffect(() => {
    if (isAuthenticated && session?.uid) {
      fetchLeads();
    }
  }, [isAuthenticated, session]);
  
  // Debug information
  console.log("Auth state:", { isAuthenticated, session, globalLoading: loading, error });
  
  // Handle manual authentication
  const handleManualAuth = async () => {
    try {
      await authenticate();
    } catch (err) {
      console.error('Manual authentication failed:', err);
    }
  };
  
  if (loading) {
    return <div>Connecting to Odoo...</div>;
  }
  
  if (error) {
    return (
      <div>
        <h2>Authentication Error</h2>
        <p>{error}</p>
        <button onClick={handleManualAuth}>Retry Authentication</button>
      </div>
    );
  }
  
  return (
    <div className="odoo-crm-container">
      <div className="auth-info">
        {isAuthenticated ? (
          <div className="auth-success">
            <h3>✅ Connected to Odoo</h3>
            <p>Logged in as: {session?.name} ({session?.username})</p>
          </div>
        ) : (
          <div className="auth-pending">
            <h3>⚠️ Not connected to Odoo</h3>
            <button onClick={handleManualAuth}>Connect Now</button>
          </div>
        )}
      </div>
      
      <h2>CRM Leads</h2>
      
      <div className="actions">
        <button 
          onClick={fetchLeads} 
          disabled={!isAuthenticated || fetchStatus.loading}
        >
          {fetchStatus.loading ? 'Loading...' : 'Refresh Leads'}
        </button>
      </div>
      
      {fetchStatus.error && (
        <div className="error-message">
          Error loading leads: {fetchStatus.error}
        </div>
      )}
      
      {fetchStatus.loading ? (
        <div>Loading leads...</div>
      ) : leads.length > 0 ? (
        <table className="leads-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Company</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Stage</th>
              <th>Probability</th>
              <th>Revenue</th>
              <th>Created</th>
            </tr>
          </thead>
          <tbody>
            {leads.map(lead => (
              <tr key={lead.id}>
                <td>{lead.name}</td>
                <td>{lead.partner_name}</td>
                <td>{lead.email_from}</td>
                <td>{lead.phone}</td>
                <td>{lead.stage_id ? lead.stage_id[1] : 'N/A'}</td>
                <td>{lead.probability}%</td>
                <td>{lead.expected_revenue ? `${lead.expected_revenue}` : 'N/A'}</td>
                <td>{new Date(lead.create_date).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <div className="no-leads">No leads found.</div>
      )}
      
      {/* Debug information (remove in production) */}
      <div className="debug-info" style={{ marginTop: '30px', padding: '10px', background: '#f5f5f5', fontSize: '12px' }}>
        <h4>Debug Information</h4>
        <pre>{JSON.stringify({ isAuthenticated, sessionInfo: session }, null, 2)}</pre>
      </div>
    </div>
  );
};

export default OdooCrmLeads;