import React from "react";

export const Header = props => {
  return (
    <section className="header">
      <div className="header__item">Game of Life</div>
      <div className="header__item">{props.generation}</div>
    </section>
  );
};
