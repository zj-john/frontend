import React, { Component, PureComponent } from "react";
import "./index.css";

export default class MenuView extends PureComponent {

  handleSelect = (e, options) =>{
    const value = e.target.value;
    const command = options.find(i=>i.text===value).command;
    command.apply(null);
  }
  renderMenuItem = (menuGroup) => {
    return menuGroup.map((menuItem) => {
      return menuItem.type === "select" ? (
        <div className="menu-select" key={menuItem.title}>
          <select onChange={(e) =>this.handleSelect(e, menuItem.options)}>
            {menuItem.options.map((o) => {
              return (
              <option key={o.text}> {o.text}</option>
              );
            })}
          </select>
        </div>
      ) : (
        <div className="menu-item" title={menuItem.title} key={menuItem.title}>
          <span onClick={!menuItem.disabled && menuItem.command}>
            {menuItem.text}
          </span>
        </div>
      );
    });
  };

  renderMenuGroup = (MenuConfig) => {
    return MenuConfig.map((menuGroup,index) => {
      return <div className="menu-group" key={index}>{this.renderMenuItem(menuGroup)}</div>;
    });
  };
  render() {
    return (
      <div className="editor-menu">
        {this.renderMenuGroup(this.props.config)}
      </div>
    );
  }
}
