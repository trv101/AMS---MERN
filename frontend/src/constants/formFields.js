const loginFields=[
    {
        labelText:"Email address",
        labelFor:"email-address",
        id:"email",
        name:"email",
        type:"email",
        autoComplete:"email",
        isRequired:true,
        placeholder:"Email address"   
    },
    {
        labelText:"Password",
        labelFor:"password",
        id:"password",
        name:"password",
        type:"password",
        autoComplete:"current-password",
        isRequired:true,
        placeholder:"Password"   
    }
]

const signupFields=[
    {
        labelText:"firstName",
        labelFor:"firstName",
        id:"firstName",
        name:"firstName",
        type:"text",
        isRequired:true,
        placeholder:"firstName"   
    },
    {
        labelText:"lastName",
        labelFor:"lastName",
        id:"lastName",
        name:"lastName",
        type:"text",
        isRequired:true,
        placeholder:"lastName"   
    },
    {
        labelText:"Email address",
        labelFor:"email-address",
        id:"email",
        name:"email",
        type:"email",
        isRequired:true,
        placeholder:"Email address"   
    },
    {
        labelText:"Password",
        labelFor:"password",
        id:"password",
        name:"password",
        type:"password",
        isRequired:true,
        placeholder:"Password"   
    },
    {
        labelText:"Confirm Password",
        labelFor:"confirm-password",
        id:"confirmpassword",
        name:"confirm-password",
        type:"password",
       
        isRequired:true,
        placeholder:"Confirm Password"   
    }
]

export {loginFields,signupFields}