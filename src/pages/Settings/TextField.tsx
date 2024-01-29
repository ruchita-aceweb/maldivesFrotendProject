// TextField.tsx

import React from 'react';

interface TextFieldProps {
  label: string;
  placeholder: string;
  key: string;
  value: string;
  onChange: (value: string) => void;
}

const TextField: React.FC<TextFieldProps> = (props) => {
  const { label, placeholder, key, value, onChange } = props;

  return (
    <div className=''>
      <label className="mb-3 block  text-black dark:text-white">{label}</label>
      <input
        type="text"
        placeholder={placeholder}
        name={key}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-100 rounded-lg border-[1.5px] border-primary bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:bg-form-input"
      />
    </div>
  );
};

export default TextField;
