import Link from 'next/link';
import React from 'react';
import { forwardRef } from 'react';


const DropdownLink = forwardRef((props,ref) => {
  let { href, children, ...rest } = props;
  return (
    <Link href={href}>
      <a {...rest}>{children}</a>
    </Link>
    )
  }
)


export default DropdownLink
