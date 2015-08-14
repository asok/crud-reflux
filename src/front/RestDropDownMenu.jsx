import React from "react";
import { DropDownMenu } from "material-ui";

// Sadly the DropDownMenu from material-ui does not have getValue() method.
// This fixes this.
// Also the "selected" value for the drop down has to be the first element
// in the array passed to DropDownMenu's menuItems prop.
// This does the work of ordering the array correctly.
module.exports = React.createClass({
  propTypes: {
    attribute: React.PropTypes.string.isRequired,
    items: React.PropTypes.array.isRequired,
    model: React.PropTypes.object.isRequired,
    sort: React.PropTypes.func,
    id: React.PropTypes.string
  },

  getInitialState() {
    if(this.props.model.isBlank(this.props.attribute))
      throw new Error(`The attribute "${this.props.attribute}" of ${this.props.model} is not set`);

    return {
      selectedIndex: this.selectedIndex(this.props.model.get(this.props.attribute))
    }
  },

  _onChange(_, __, item) {
    this.props.model.set(this.props.attribute, item.payload);
  },

  getSelectedValue() {
    return this.props.model.get(this.props.attribute);
  },

  getValue() {
    return this.getSelectedValue();
  },

  selectedIndex(payload) {
    var index = this.props.items.map((i)=> i.payload).indexOf(payload);
    if(index === -1)
      return 0;
    else
      return index;
  },

  items() {
    if(this.props.sort)
      return this.props.items.sort(this.props.sort);
    else
      return this.props.items;
  },

  componentWillReceiveProps(nextProps) {
    this.setState({selectedIndex: this.selectedIndex(nextProps.model.get(nextProps.attribute))});
  },

  render() {
    return (
      <div style={this.props.wrapperStyle}>
        <label style={this.props.labelStyle}>{this.props.label}</label>
        <DropDownMenu id={this.props.id || this.props.attribute}
                      errorText={this.props.model.errors[this.props.attribute]}
                      onChange={this._onChange}
                      selectedIndex={this.state.selectedIndex}
                      menuItems={this.items()}
                      className={this.props.className}
                      underlineStyle={this.props.underlineStyle}
                      iconStyle={this.props.iconStyle}
                      labelStyle={this.props.dropDownLabelStyle}
                      style={this.props.style} />
      </div>
    )
  }
});
