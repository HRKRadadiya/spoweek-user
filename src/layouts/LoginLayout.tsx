import React, { FC } from 'react'
interface Props {
    // any props that come into the component
}
const LoginLayout: FC<Props> = ({ children, ...props }) => {
    return (
        
            <div {...props} className="logout-bg">{children}</div>

        
    )
}

export default LoginLayout
