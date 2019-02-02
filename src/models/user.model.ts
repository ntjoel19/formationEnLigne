//Ceci est l'interface en charge de capturer les informations relatives à un utilisateur
export interface User{
    key? : string; // The User's ID
    pseudo : string; // -- THe User's login
    password : string; // -- the user's password
    email : string; // -- The User's mail
    name : string; // -- The User's name
    chat: [
        {
            ChatWith:string;//the email of the person he messages
            messages:[
                {
                    me:boolean;
                    msg:string;
                    date:string;
                }
            ]
        }
    ]
    birthdate : Date; // --
    firstname:string; // --
    phone:number; // --
    status : string; // -- is about the role
    level : number; 
    accepted : boolean // -- true if the account has been validated by an admin, false otherwise.
    notification : [
        {
            reason : string; //objet de la notification. Ex: nouveau cours disponible
            date : string;
            author : string;
        }
    ]
    // --
    courses : [
        {
            key? : string; // The course ID
            title: string;
            PostedBy:string;
            descriptImage: string;
            authorisation:boolean;
            subtitle: string;
            description: string;
            teacher: string;
            post_date : string;
            duration: string;
            numberOfStudents : number;
            chapter : [
                {
                    title: string;
                    duration : string;
                    description: string;
                    lecon : [
                        {
                            title: string;
                            description : string;
                            materials : [
                                {
                                    name:string;
                                    type:string;
                                    content : string;
                                }
                            ],
                            quizz:[
                                {
                                    name:string;
                                    type:string;
                                    content : string;
                                }
                            ]
                        }
                    ]
                }
            ]
        }
    ];
    avatar: {
        created: any,
        fullPath: any,
        contentType: any,
        url: any,
        key:string
    };
    homeworks: [
        {
            done: boolean,
            seen: boolean,
            file:{
                name:string;
                type:string;
                content : string;
            },
            note:number,
            teacher:string,
            associateProf:[
                {
                    email:string;
                }
            ]
            submitionDate: string,
            pfmName:string,
            chapterName: string,
            leconName:string,
            studentComment:string,
            teacherComment:string,
            comments:[
                {
                    date: string;
                    author: string;
                    message:string
                }
            ]
            exerciseName: string
        }
    ]
}