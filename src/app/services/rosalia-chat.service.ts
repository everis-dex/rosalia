import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';

@Injectable({
  providedIn: 'root',
})
export class RosaliaChatService {
  userId = '';
  constructor(private http: HttpClient, private translate: TranslateService) {}

  public getLang(): number[] {
    const lang = this.translate.currentLang;
    if(lang === 'es') {
      return [1, 0];
    } else{
      return [0, 1];
    }
  }

  public sendQuery(query: string): Observable<any> {
    const url = 'https://api.dolffia.com/compose/process';
    let body = {};
    if(this.userId != '') {
      body = {
        generic: {
          compose_conf: {
            template: {
              name: ['RosalIA_es', 'RosalIA_gl'],
              probs: this.getLang(),
              params: {
                query: query,
              },
            },
            persist: {
              session_id: this.userId,
              type: 'mixqueries',
              params: {
                max_persistance: 3,
              },
            },
            queryfilter_template: 'rosalIA_queryfilter',
          },
        },
        credentials: {},
        specific: { dataset: { dataset_key: '' } },
      };
    } else {
      body = {
        generic: {
          compose_conf: {
            template: {
              name: ['RosalIA_es', 'RosalIA_gl'],
              probs: this.getLang(),
              params: {
                query: query,
              },
            },
            persist: {
              type: 'mixqueries',
              params: {
                max_persistance: 3,
              },
            },
            queryfilter_template: 'rosalIA_queryfilter',
          },
        },
        credentials: {},
        specific: { dataset: { dataset_key: '' } },
      };
    }
    const headers = new HttpHeaders({
      'Content-type': 'application/json',
      'x-api-key': 'e56db1246ded4e6d9604a8e201dccff0',
    });
    return this.http.post(url, body, { headers: headers });
  }

  public async getResponse(query: string): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      this.sendQuery(query).subscribe({
        next: (response) => {
          let messageReceived = '';
          if(response.result.session_id) {
            this.userId = response.result.session_id;
          };
          response.result.streambatch[0].forEach((element: any) => {
            if (element.answer) {
              messageReceived = element.answer;
            }
          });
          resolve(this.formatResponse(messageReceived));
        },
        error: (error) => {
          let errorMsg = '';
          if(error.error.error_message.indexOf('content') !== -1) {
            this.translate.get('content_error').subscribe((translation: string) => {
              errorMsg = translation;
            });
          } else {
            this.translate.get('generic_error').subscribe((translation: string) => {
              errorMsg = translation;
            });
          }
          resolve(errorMsg)
        },
      });
    });
  }

  public formatResponse(response: string): string {
    return response.replace(/\n/g, '<br/>');
  }
}
