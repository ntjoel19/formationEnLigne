import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';
import { AngularFireDatabase } from 'angularfire2/database';
import { AngularFireStorage } from 'angularfire2/storage';


@Injectable()
export class DataProvider {
  constructor(
    private db:AngularFireDatabase,
    private afStorage: AngularFireStorage,
    ) {
    //console.log('Hello DataProvider Provider');
  }

  getFiles(){
    let ref = this.db.list('files');
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

  storeInfoToDatabase(metainfo,url){
    let toSave={
      created: metainfo.timeCreated,
      fullPath: metainfo.fullPath,
      contentType: metainfo.contentType,
      key:'',
      url: url
    }

    let key = this.db.list('files').push(toSave).key;
    toSave['key']=key
    this.db.list('files').update(toSave.key, toSave);
    return toSave
  }

  deleteFile(file){
    let key = file.key;
    let storagePath = file.fullPath;

    this.db.list('/files').remove(key)
    return this.afStorage.ref(storagePath).delete();
  }

  

  encodeImageUri(imageUri, objType, callback) {
    var c = document.createElement('canvas');
    var ctx = c.getContext("2d");
    var img = new Image();
    img.onload = () => {
      var aux:any = this;
      c.width = aux.width;
      c.height = aux.height;
      ctx.drawImage(img, 0, 0);
      var dataURL = c.toDataURL(objType);
      callback(dataURL);
    };
    img.src = imageUri;
    //console.dir(img)
  }
}
