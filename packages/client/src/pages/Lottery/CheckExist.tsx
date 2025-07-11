import React, { useContext } from 'react';
import { Input, Button, message } from 'antd';
import { useStore } from '@/stores/useStore';
import { emit } from '@/utils/event-bus';

const CheckExist: React.FC = () => {
    const store = useStore();
    const { queryExist } = store.LotteryStore;

    const [redBallInput, setRedBallInput] = React.useState('');
    const [blueBallInput, setBlueBallInput] = React.useState('');

    const handleRedBallChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setRedBallInput(e.target.value);
    };

    const handleBlueBallChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setBlueBallInput(e.target.value);
    };

    const checkBalls = async () => {
        const redBallToCheck = redBallInput?.split?.(',');
        const blueBallToCheck = parseInt(blueBallInput, 10);
        if(redBallToCheck.length !== 6) {
            emit('antdMessage', {type: 'warning', content: '红球个数必须6个'});
            return;
        }
          if(!blueBallToCheck) {
            emit('antdMessage', {type: 'warning', content: '蓝球必须有一个'});
            return;
        }
        const result = await queryExist({ redBalls: redBallToCheck, blueBall: blueBallToCheck });
        const msg: string = result === -1 ? '接口错误' : result === 1 ? '这组号码已存在' : '这组号码不存在';
        const type = result === 0 ? 'warning' : result === -1 ? 'error' : 'success'
        emit('antdMessage', { type, content: msg });


    };

    return (
        <div className="mb-6 flex justify-end">
            <Input
                placeholder="请输入要查询的红球号码"
                value={redBallInput}
                onChange={handleRedBallChange}
                style={{ marginRight: 16, width: 200 }}
            />
            <Input
                placeholder="请输入要查询的蓝球号码"
                value={blueBallInput}
                onChange={handleBlueBallChange}
                style={{ marginRight: 16, width: 200 }}
            />
            <Button type="primary" onClick={checkBalls}>
                查询
            </Button>
        </div>
    );
};

export default CheckExist;