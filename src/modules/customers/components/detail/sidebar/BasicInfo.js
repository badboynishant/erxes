import React from 'react';
import PropTypes from 'prop-types';
import { Sidebar } from 'modules/layout/components';
import { SidebarContent } from 'modules/layout/styles';
import { AvatarWrapper } from 'modules/activityLogs/styles';
import {
  Button,
  Icon,
  FormControl,
  FormGroup,
  NameCard
} from 'modules/common/components';
import { Alert } from 'modules/common/utils';
import {
  AboutList,
  Aboutvalues,
  NameWrapper,
  ButtonWrapper,
  AboutWrapper
} from './styles';

const propTypes = {
  customer: PropTypes.object.isRequired,
  save: PropTypes.func.isRequired
};

class BasicInfo extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      editing: false
    };

    this.toggleEditing = this.toggleEditing.bind(this);
    this.cancelEditing = this.cancelEditing.bind(this);
    this.save = this.save.bind(this);
  }

  componentWillReceiveProps(newProps) {
    const { customer } = newProps;
    const oldcustomer = this.props.customer;
    if (customer._id !== oldcustomer._id) {
      this.cancelEditing();
    }
  }

  toggleEditing() {
    this.setState({ editing: true });
  }

  cancelEditing() {
    this.setState({
      editing: false
    });
  }

  save() {
    const doc = {
      firstName: document.getElementById('firstName').value,
      lastName: document.getElementById('lastName').value,
      email: document.getElementById('email').value,
      phone: document.getElementById('phone').value
    };

    this.props.save(doc, error => {
      if (error) return Alert.error(error.message);

      this.cancelEditing();
      return Alert.success('Success');
    });
  }

  getVisitorInfo(customer, key) {
    return customer.visitorContactInfo && customer.visitorContactInfo[key];
  }

  renderForm() {
    const { customer } = this.props;

    return (
      <SidebarContent>
        <br />
        <FormGroup>
          First name:
          <FormControl id="firstName" defaultValue={customer.firstName} />
        </FormGroup>
        <FormGroup>
          Last name:
          <FormControl id="lastName" defaultValue={customer.lastName} />
        </FormGroup>
        <FormGroup>
          Primary Email:
          <FormControl
            id="email"
            defaultValue={
              customer.email || this.getVisitorInfo(customer, 'email')
            }
          />
        </FormGroup>
        <FormGroup>
          Phone:
          <FormControl
            id="phone"
            defaultValue={
              customer.phone || this.getVisitorInfo(customer, 'phone')
            }
          />
        </FormGroup>
        <ButtonWrapper>
          <Button
            btnStyle="success"
            size="small"
            onClick={this.save}
            icon="checkmark"
          />
          <Button
            btnStyle="simple"
            size="small"
            onClick={this.cancelEditing}
            icon="close"
          />
        </ButtonWrapper>
      </SidebarContent>
    );
  }

  renderName(customer) {
    if (customer.firstName || customer.lastName) {
      return (customer.firstName || '') + ' ' + (customer.lastName || '');
    }
    return <a onClick={this.toggleEditing}>Edit name</a>;
  }

  renderInfo() {
    const { customer } = this.props;
    const isUser = customer.isUser;

    return (
      <SidebarContent>
        <NameWrapper>
          <AvatarWrapper isUser={isUser}>
            <NameCard.Avatar customer={customer} size={50} />
            {isUser ? <Icon icon="checkmark" /> : <Icon icon="minus" />}
          </AvatarWrapper>
          <div className="customer-name">
            {customer.name || this.renderName(customer)}
          </div>
          <a>
            <Icon icon="edit" onClick={this.toggleEditing} />
          </a>
        </NameWrapper>
        <AboutWrapper>
          <AboutList>
            <li>
              Email:
              <Aboutvalues>
                {customer.email ||
                  this.getVisitorInfo(customer, 'email') || (
                    <a onClick={this.toggleEditing}>Add Email</a>
                  )}
              </Aboutvalues>
            </li>
            <li>
              Phone:
              <Aboutvalues>
                {customer.phone ||
                  this.getVisitorInfo(customer, 'phone') || (
                    <a onClick={this.toggleEditing}>Add Phone</a>
                  )}
              </Aboutvalues>
            </li>
          </AboutList>
        </AboutWrapper>
      </SidebarContent>
    );
  }

  render() {
    return (
      <Sidebar.Section>
        {this.state.editing ? this.renderForm() : this.renderInfo()}
      </Sidebar.Section>
    );
  }
}

BasicInfo.propTypes = propTypes;

export default BasicInfo;
