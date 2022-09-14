import React, { forwardRef, useState } from "react";
import { Button, Input, InputGroup, InputProps, InputRightElement } from "@chakra-ui/react";

export const  PasswordInput = forwardRef<HTMLInputElement, InputProps>((props: InputProps, ref) => {
  const [show, setShow] = useState(false);

  const handleShow = () => {
    setShow(prev => !prev)
  };

  return (
    <InputGroup size='md'>
      <Input
        ref={ref}
        pr='4.5rem'
        type={show ? 'text' : 'password'}
        placeholder='Enter password'
        {...props}
      />
      <InputRightElement width='4.5rem'>
        <Button h='1.75rem' size='sm' onClick={handleShow}>
          {show ? 'Hide' : 'Show'}
        </Button>
      </InputRightElement>
    </InputGroup>
  );
});