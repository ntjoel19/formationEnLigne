//voici en gros la structure du document qui gère les cours
//1-commme on peut le constater, un  cours contient des chapitres, lesquels chapitres contiennent des lecons
//qui à leur tours contiennent des lecons qui finalement à leur tour contiennent du matériel.
// ce que nous appellons matériel ici, c'est l'ensemble des documents liés à une lecon. ca peut etre des 
// pdf, vidéos, présentations, simple texte en dur...
export interface Course{
    key? : string; // The course ID
    title: string;
    descriptImage: string;
    authorisation:boolean;
    subtitle: string;
    description: string;
    teacher: string;
    associateProf:[
        {
            email:string;
        }
    ]
    PostedBy:string;
    post_date : string;
    duration: string;
    startDate: string;
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