import { HttpClient, HttpParamsOptions } from '@angular/common/http';
import { Component, Input } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  private __url: string;

  clientForm: any;
  
  @Input()
  requiredFileType :string | undefined;

  fileName: string | undefined = '';
  uploadProgress:number| undefined;
  uploadSub: any;

  __maxBytes: number = 10485760; 

  __files: FileList | undefined;

  __isValidateFormat: Boolean = true;
  __isValidateSize: Boolean = true;
  __isValidateMaxFiles: Boolean = true;
  
  constructor(private fb: FormBuilder, private http: HttpClient) {
    this._createForm();
    this.__url = "https://localhost:44374/api/Persons";
  }

  private _createForm() {
    this.clientForm = this.fb.group({
      client: ['', [Validators.required, Validators.email]],
      file: ['', [Validators.required]],
    })
  }

  onFileSelected(event: any) {
    console.log(event.target.files);

    this.fileName = event.target.files[0].name;

    this.__files = event.target.files;

    if(this.__files == undefined) return;

    if(this.__files.length > 10)
    {
      this.__isValidateMaxFiles = false;
      return;
    }

    for (let index = 0; index < this.__files.length; index++) {
        if (this.__files[index].type === '' || this.__files[index].type !== 'application/pdf') {
          console.log('Error, not validate format files');
          this.__isValidateFormat = false;
        }
        else
        {
          // if(index > 1 && this.__isValidateFormat !== false)
          // {
             this.__isValidateFormat = true;
          //}
        }

        if(this.__files[index].size >= this.__maxBytes) {
          console.log('Error, not validate format files');
          this.__isValidateSize = false;
        }
        else
        { 
          // if(index > 1 && this.__isValidateSize !== false)
          // {
             this.__isValidateSize = true;
          //}
        }
    }

    // if (file) {
    //     this.fileName = file.name;
        // const formData = new FormData();
        // formData.append("thumbnail");

        // const upload$ = this.http.post("/api/thumbnail-upload", formData, {
        //     reportProgress: true,
        //     observe: 'events'
        // })
        // .pipe(
        //    // finalize(() => this.reset())
        // );
      
        // this.uploadSub = upload$.subscribe(event => {
        //   if (event.type == HttpEventType.UploadProgress) {
        //     this.uploadProgress = Math.round(100 * (event.loaded / event.total));
        //   }
        // })
    }
//}

cancelUpload() {
    this.uploadSub.unsubscribe();
    this.reset();
}

reset() {
}

submit() {
  console.log(this.__files);
   
  if(this.__files == undefined) return;
 
  const formData = new FormData();
  
  if(this.__isValidateFormat == true && this.__isValidateMaxFiles == true && this.__isValidateSize == true)
  {
    const files : File[] = [];

    for (let index = 0; index < this.__files.length; index++) {
      const file : File = this.__files[index];
      formData.append('Files', file);
    }

    formData.append('Email', this.clientForm.get('client').value);
    
    const options = {} as any; // Set any options you like

    this.http.post(this.__url, formData, options)
      .subscribe(res => {
      console.log(res);
      alert('Uploaded Successfully.');
      });
  }
}

  public _setFiles(files : any)
  {
  }

  get _client() {
    return this.clientForm.get('client')
  }

  get _clientFile() {
    return this.clientForm.get('file')
  }
}

function checkFileType(control: AbstractControl): { [key: string]: any } | null {
  const files: File[] = control.value;
  console.log(control);
  const maxBytes: number = 10485760; 
  let errors: string[] = [];
 
 if (files.length >= 1 ) {
     for (let index = 0; index < files.length; index++) {
         
      if (files[index].type === '' || files[index].type !== 'application/pdf') {
        console.log('Error, not validate format files');                 
        errors.push(`${files[index].name} has an invalid type of unknown\n`);
      }

      if(files[index].size >= maxBytes) {
        console.log('Error, not validate format files');
        errors.push(`Error ${files[index].name} has an size file > 10 MB\n`);
      }
     }

     console.log(errors);
     return  errors.length >= 1 ? { invalid_type: errors } : null;           
 }
 
 console.log(errors);
 return null;
}
