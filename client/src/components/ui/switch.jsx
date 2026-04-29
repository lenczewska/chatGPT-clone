import React from "react";
import styled from "styled-components";

const Switch = ({ checked, onCheckedChange }) => {
  return (
    <StyledWrapper>
      <label>
        <input
          className="toggle-checkbox"
          type="checkbox"
          checked={checked}
          onChange={() => onCheckedChange(!checked)}
        />
        <div className="toggle-slot">
          <div className="sun-icon-wrapper">
            <div
              className="iconify sun-icon"
              data-icon="feather-sun"
              data-inline="false"
            />
          </div>
          <div className="toggle-button" />
          <div className="moon-icon-wrapper">
            <div
              className="iconify moon-icon"
              data-icon="feather-moon"
              data-inline="false"
            />
          </div>
        </div>
      </label>
    </StyledWrapper>
  );
};

const StyledWrapper = styled.div`
  .toggle-checkbox {
    position: absolute;
    opacity: 0;
    cursor: pointer;
    height: 0;
    width: 0;
  }

  .toggle-slot {
    font-size: 10px;
    position: relative;
    height: 3em;
    width: 6.5em;
    border: 0px solid transparent;
    border-radius: 10em;
    background-color:  #D3D9E1;
    transition: background-color 250ms;
  }

  .toggle-checkbox:checked ~ .toggle-slot {
    background-color: #6D5FB9;
  }

  .toggle-button {
    transform: translate(0.3em, 0.25em);
    position: absolute;
    height: 2.5em;
    width: 2.5em;
    border-radius: 50%;
    box-shadow: inset 0px 0px 0px 0.75em #434548;
    transition:
      background-color #D3D9E1,
      border-color 250ms,
      transform 500ms cubic-bezier(0.26, 2, 0.46, 0.71);
  }

  .toggle-checkbox:checked ~ .toggle-slot .toggle-button {
    background-color: #D3D9E1;
    box-shadow: inset 0px 0px 0px 0.75em white;
    transform: translate(3.65em, 0.25em);
  }
`;

export default Switch;
