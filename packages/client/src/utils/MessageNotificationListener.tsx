// utils/NavigationListener.jsx
import { useEffect } from 'react';
import { message,notification } from 'antd'
import { on, off } from './event-bus';

const MessageNotificationListener = () => {
  const [msgApi, msgHolder] = message.useMessage();
   const [notiApi, notiHolder] = notification.useNotification();


  useEffect(() => {

    const showMessage = ({ type, content }: { type: 'success' | 'error' | 'warning' | 'info'; content: string }) => {
      msgApi[type](content);
    }

    const showNotification = ({type, options}: {type: 'success' | 'error' | 'warning' | 'info'; options: any}) => {
      notiApi[type](options)
    }

    on('antdMessage', showMessage);
    on('antdNotification', showNotification);

    return () => {
      off('antdMessage', showMessage);
      off('antdNotification', showNotification);
    };
  }, [msgApi, notiApi]);

  return <>{msgHolder}{notiHolder}</>;
};

export default MessageNotificationListener;