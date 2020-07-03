import React, { Component, PureComponent } from "react";
import "./index.css";

export default class MenuView extends PureComponent {
  renderMenuItem = (menuGroup) => {
    return menuGroup.map((menuItem) => {
      return menuItem.type === "select" ? (
        <div className="menu-select" key={menuItem.title}>
          <select>
            {menuItem.options.map((o) => {
              return (
                <option onClick={!o.disabled && o.command} key={o.text}> {o.text}</option>
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
