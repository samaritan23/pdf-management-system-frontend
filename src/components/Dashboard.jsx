import React from 'react';
import './Dashboard.css';

const documents = [
  {
    title: 'Employee Handbook Acknowledgment',
    lastUpdate: 'May 21, 2023',
    category: 'Onboarding',
    version: 'v.3',
    count: '67/67',
    warning: false,
    alert: false
  },
  {
    title: 'I-9 form',
    lastUpdate: 'Dec 21, 2020',
    category: 'Onboarding',
    version: 'v.2021',
    count: '65/67',
    warning: true,
    alert: true
  },
  {
    title: 'W-4 form',
    lastUpdate: 'Jan 01, 2022',
    category: 'Onboarding',
    version: 'v.1',
    count: '67/67',
    warning: false,
    alert: false
  },
  {
    title: '1099 form',
    lastUpdate: 'Feb 14, 2023',
    category: 'Onboarding',
    version: 'v.3',
    count: '32/32',
    warning: false,
    alert: false
  },
  {
    title: 'Direct Deposit Authorization',
    lastUpdate: 'May 01, 2023',
    category: 'Onboarding',
    version: 'v.2',
    count: '11/23',
    warning: false,
    alert: false
  },
  {
    title: 'Employment Agreement',
    lastUpdate: 'Apr 14, 2023',
    category: 'Miscellaneous',
    version: 'v.9',
    count: '67/67',
    warning: false,
    alert: false
  },
  {
    title: 'Non-Disclosure Agreement',
    lastUpdate: 'Nov 11, 2022',
    category: 'Miscellaneous',
    version: 'v.12',
    count: '42/44',
    warning: false,
    alert: true
  },
  {
    title: 'COBRA Notice',
    lastUpdate: 'Aug 24, 2022',
    category: 'Termination',
    version: 'v.1',
    count: '3/3',
    warning: false,
    alert: false
  },
];

const Dashboard = () => {
  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Documents</h1>
        <div className="dashboard-controls">
          <div className="dashboard-tabs">
            <button className="tab active">Documents</button>
            <button className="tab">Archived</button>
          </div>
          <button className="add-document">
            <span className="icon">+</span>
            Add Document
          </button>
        </div>
      </div>
      <div className="dashboard-search-filter">
        <input type="text" className="search-bar" placeholder="Search" />
        <button className="filter-button">Filters</button>
      </div>
      <div className="document-cards">
        {documents.map((doc, index) => (
          <div className="document-card" key={index}>
            <h2>{doc.title}</h2>
            <p className="last-update">Last Update: {doc.lastUpdate}</p>
            <div className="document-meta">
              <span className="category">{doc.category}</span>
              <span className="version">{doc.version}</span>
            </div>
            <div className="document-count">{doc.count}</div>
            {doc.alert && <div className="alert-icon">!</div>}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
