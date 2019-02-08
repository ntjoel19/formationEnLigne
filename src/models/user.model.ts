//Ceci est l'interface en charge de capturer les informations relatives à un utilisateur
export interface User{
    key? : string; // The User's ID
    pseudo : string; // -- THe User's login
    password : string; // -- the user's password
    email : string; // -- The User's mail
    name : string; // -- The User's name
    firstname:string; // --
    chat: [
        {
            ChatWith:string;//the email of the person he messages
            messages:[
                {
                    seen:boolean;
                    me:boolean;
                    msg:string;
                    date:string;
                }
            ]
        }
    ]
    avatar: {
        created: any,
        fullPath: any,
        contentType: any,
        url: any,
        key:string
    };
}