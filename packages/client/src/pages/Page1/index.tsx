// client/src/components/Page1.tsx
import React from 'react';
import {Button} from 'antd'
import { observer } from 'mobx-react';
import { useStore } from '../store/useStore';

const Page1: React.FC = observer(() => {
  const store = useStore();
  const { data, fetchData } = store.Page1Store;

  return (
    <div>
      <Button onClick={fetchData}>获取数据</Button>
      <ul>
        {data.map((item: string) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </div>
  );
});

export default Page1;