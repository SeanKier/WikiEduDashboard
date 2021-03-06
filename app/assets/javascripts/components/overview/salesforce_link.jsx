import React from 'react';
import createReactClass from 'create-react-class';
import PropTypes from 'prop-types';
import { extractSalesforceId } from '../../utils/salesforce_utils.js';

const SalesforceLink = createReactClass({
  propTypes: {
    course: PropTypes.object,
    current_user: PropTypes.object,
    linkToSalesforce: PropTypes.func.isRequired,
    updateSalesforceRecord: PropTypes.func.isRequired
  },

  linkToSalesforce() {
    const rawSalesforceId = prompt('Enter the Salesforce record ID or url for this course.');
    if (!rawSalesforceId) { return; }
    const salesforceId = extractSalesforceId(rawSalesforceId);
    if (!salesforceId) {
      alert('That input did not include a valid Salesforce record ID or url.');
      return;
    }
    return this.props.linkToSalesforce(this.props.course.id, salesforceId);
  },

  updateSalesforceRecord() {
    this.props.updateSalesforceRecord(this.props.course.id)
      .then(alert('updating!'));
  },

  render() {
    // Render nothing if user isn't an admin, or if Salesforce isn't configured
    if (!this.props.current_user.admin || !window.SalesforceServer) {
      return <div />;
    }
    // If Salesforce ID is present, show the admin a link to Salesforce
    // and a button to update the Salesforce record.
    if (this.props.course.flags.salesforce_id) {
      const openLink = window.SalesforceServer + this.props.course.flags.salesforce_id;
      return (
        <div>
          <div key="link_salesforce" className="available-action"><button onClick={this.linkToSalesforce} className="button">Update Salesforce ID</button></div>
          <div key="open_salesforce" className="available-action"><a href={openLink} className="button" target="_blank">Open in Salesforce</a></div>
          <div key="update_salesforce" className="available-action"><button onClick={this.updateSalesforceRecord} className="button" target="_blank">Update Salesforce record</button></div>
        </div>
      );
    }
    // If no Salesforce ID is present, show the "Link to Salesforce" buttton
    return (
      <p key="link_salesforce"><button onClick={this.linkToSalesforce} className="button">Link to Salesforce</button></p>
    );
  }
});

export default SalesforceLink;
