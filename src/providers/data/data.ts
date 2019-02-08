import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';
import { AngularFireDatabase } from 'angularfire2/database';
import { AngularFireStorage } from 'angularfire2/storage';
import { AngularFirestore } from 'angularfire2/firestore';


/**
 * @author Ntepp J96n J09l
 */
@Injectable()
export class DataProvider {
  constructor(
    private db:AngularFireDatabase,
    private afStorage: AngularFireStorage,
    private fireStore: AngularFirestore
    ) {
    //console.log('Hello DataProvider Provider');
  }

  getFiles(){
    let ref = this.db.list('files');
    return ref.valueChanges()
  }
  getFiles2(){
    let ref = this.fireStore.collection<any>('files');
    return ref.valueChanges()
  }

  uploadToStorage(information,folder,ext):any{
    let newName =  `${new Date().getTime()}${ext}`;
    return new Promise<any>((resolve, reject) => {
      this.afStorage.ref(`${folder}/${newName}`).putString(information,'base64')
        .then(snapshot => {
          resolve(snapshot)
        }, err => {
          reject(err);
        })
      })
    //return {'task':task,'ref':this.afStorage.ref(`${folder}/${newName}`)}
  }

  
  storeInfoToDatabase2(metainfo,url){
    let toSave={
      created: metainfo.timeCreated,
      fullPath: metainfo.fullPath,
      contentType: metainfo.contentType,
      key:'',
      url: url
    }

    this.fireStore.doc<any>(`files/${toSave.fullPath.split('/')[0]}-${toSave.fullPath.split('/')[1]}`).set(toSave);
    return toSave
  }

  addFile(file){
    this.fireStore.doc<any>(`files/${file.fullPath.split('/')[0]}-${file.fullPath.split('/')[1]}`).set(file);
  }

  deleteFile2(file){
    let key = file.key;
    let storagePath = file.fullPath;

    this.fireStore.doc<any>(`files/${file.fullPath.split('/')[0]}-${file.fullPath.split('/')[1]}`).delete()
    return this.afStorage.ref(storagePath).delete();
  }

}
