import React from 'react';
import styled from 'styled-components';
import { useAppContext } from '@/context/AppContext';

const Version = () => {
  const { theme } = useAppContext();

  return (
    <StyledWrapper isDark={theme === 'dark'}>
      <div className="badge">
        v 1.0.0
        <span />
      </div>
    </StyledWrapper>
  );
};

const StyledWrapper = styled.div`
  .badge {
    position: relative;
    display: inline-block;
    text-decoration: none;
    padding: 4px 10px;
    font-size: 11px;
    font-weight: 500;
    user-select: none;
    border-radius: 999px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);

    /* динамические стили */
    background: ${({ isDark }) => (isDark ? '#4a3a6b' : '#000')};
    color: ${({ isDark }) => (isDark ? 'white' : 'white')};
    border: 1px solid ${({ isDark }) =>
      isDark ? 'rgba(255,255,255,0.18)' : 'rgba(0,0,0,0.3)'};
  }

  .badge span {
    width: 14px;
    height: 14px;
    position: absolute;
    top: -7px;
    right: -2px;
    transform: rotate(-20deg);
    filter: blur(0.5px);
  }

  .badge span:before,
  .badge span:after {
    content: '';
    position: absolute;
  }

  .badge span:before {
    width: 1px;
    height: 100%;
    left: 7px;
    background: linear-gradient(
      to bottom,
      transparent,
      rgba(255, 255, 255, 0.7),
      transparent
    );
  }

  .badge span:after {
    width: 100%;
    height: 1px;
    top: 7px;
    background: linear-gradient(
      to left,
      transparent,
      rgba(255, 255, 255, 0.7),
      transparent
    );
  }

  .badge:hover span:after {
    display: block;
    animation: rotate 3s ease-in-out;
  }
  .badge:hover span::before {
    display: block;
    animation: rotate 3s ease-in-out;
  }

  @keyframes rotate {
    0% {
      transform: rotate(0deg) scale(1);
    }
    50% {
      transform: rotate(180deg) scale(1.8);
    }
    100% {
      transform: rotate(360deg) scale(1);
    }
  }
`;

export default Version;
