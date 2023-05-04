import React from "react";
import { ReactNode, useEffect, useState } from "react";
import ReactDOM from "react-dom";
import { createRoot } from 'react-dom/client';

interface ToastProp {
  type?: 'error' | 'success' | 'info' | 'warning',
  className?: string;
  placement?: 'top' | 'left' | 'bottom' | 'right',
  content: ReactNode;
  duration?: number;
}


const Toast: React.FC<ToastProp> = (
  {
    type,
    className,
    placement,
    content,
  }
) => {
  const [typeClasses, setTypeClasses] = useState<string>('');
  const [place, setPlace] = useState<string>('');

  useEffect(() => {
    let temp = '';
    switch (type) {
      case 'error':
        temp = 'alert-error';
        break;
      case 'success':
        temp = 'alert-success';
        break;
      case 'warning':
        temp = 'alert-warning';
        break;
      default:
        temp = 'alert-info';
        break;
    }
    setTypeClasses(temp);
  }, [type])

  useEffect(() => {
    let temp = '';
    switch (placement) {
      case 'bottom':
        temp = 'toast-bottom';
        break;
      case 'left':
        temp = 'toast-start';
        break;
      case 'right':
        temp = 'toast-end';
        break;
      default:
        temp = 'toast-top';
        break;
    }
    setPlace(temp);
  }, [placement])

  return (
    <div className={`toast ${className} ${place}`}>
      <div className={`alert ${typeClasses}`}>
        <div>
          <span>{content}</span>
        </div>
      </div>
    </div>
  )
}

export const toast = (params: ToastProp) => {
  const container = document.createElement('div');
  document.body.appendChild(container);
  const root = createRoot(container);
  const handleUnmount = () => {
    root.unmount();
  };
  if (params.duration === undefined || params.duration) {
    setTimeout(() => {
      handleUnmount();
    }, params.duration || 3000)
  }

  root.render(<Toast {...params} />);
  return handleUnmount;
}
