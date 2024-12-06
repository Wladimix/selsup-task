import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
    <App />
);

type paramTypes = 'text' | 'number' | 'select'

interface Param {
    id: number;
    name: string;
    type: paramTypes;
    options?: string[];
}

interface ParamValue {
    paramId: number;
    value: string | number;
}

interface Color {
    id: number;
    name: string;
}

interface Model {
    paramValues: ParamValue[];
    colors: Color[];
}

function App() {
    const params: Param[] = [
        {
            id: 1,
            name: 'Назначение',
            type: 'text'
        },
        {
            id: 2,
            name: 'Длина',
            type: 'text'
        }
    ]

    const model: Model = {
        paramValues: [
            {
                paramId: 1,
                value: 'повседневное'
            },
            {
                paramId: 2,
                value: 'макси'
            }
        ],
        colors: [
            {
                id: 1,
                name: 'красный'
            },
            {
                id: 2,
                name: 'жёлтый'
            },
            {
                id: 3,
                name: 'зелёный'
            }
        ]
    }

    return (
        <ParamEditor params={params} model={model} />
    );
}

interface ParamEditorProps {
    params: Param[];
    model: Model;
}

function ParamEditor(props: ParamEditorProps) {
    const productParamStyle: React.CSSProperties | undefined = {
        border: '1px solid',
        display: 'inline-block',
        padding: '10px',
        margin: '20px'
    }

    const structureStyle: React.CSSProperties | undefined = {
        marginLeft: '20px'
    }

    const [model, setModel] = useState<Model>(props.model);

    const getParamById = (id: number): Param => (
        props.params.filter(param => param.id === id)[0]
    );

    const getModel = () => {
        console.log(model)
    }

    return (
        <>
            <div style={productParamStyle}>
                {
                    props.model.paramValues.map(paramValue =>
                        <ProductParam
                            key={paramValue.paramId}
                            param={getParamById(paramValue.paramId)}
                            model={model}
                            setModel={setModel}
                        />
                    )
                }
            </div>

            <div style={structureStyle}>
                <button onClick={getModel}>
                    вывести структуру модели в консоль
                </button>
            </div>
        </>
    );

}

interface ProductParamProps {
    param: Param;
    model: Model;
    setModel: React.Dispatch<React.SetStateAction<Model>>
}

function ProductParam(props: ProductParamProps) {
    const productParamStyle: React.CSSProperties | undefined = {
        display: 'flex',
        margin: '5px 0px 5px 0px'
    }

    const getParamValueById = (id: number) => (
        props.model.paramValues.find(value => value.paramId === id)?.value
    );

    const editParamValueById = (id: number, newValue: any) => (
        props.model.paramValues.map(paramValue => (
            paramValue.paramId === id ? { ...paramValue, value: newValue } : paramValue
        ))
    );

    const changeValueHandler = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        props.setModel({ ...props.model, paramValues: editParamValueById(
            props.param.id,
            props.param.type === 'number' ? Number(e.target.value) : e.target.value
        )})
    };

    let input = <input
        type={props.param.type}
        value={getParamValueById(props.param.id)}
        onChange={changeValueHandler}
    />;

    if (props.param.type === 'select') {
        const option = props.param.options && props.param.options.length !== 0
            ?   props.param.options?.map(option =>
                    <option key={option}>{option}</option>
                )
            :   <option>значения отсутствуют</option>;

        input = <select
            value={getParamValueById(props.param.id)}
            onChange={changeValueHandler}
        >
            {option}
        </select>
    }

    return (
        <div style={productParamStyle}>

            <div style={{width: '200px', textAlign: 'center'}}>
                <label>{props.param.name}</label>
            </div>

            <div>{input}</div>

        </div>
    );

}
