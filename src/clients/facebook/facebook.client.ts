import { HttpService } from '@nestjs/axios';
import { HttpException, Injectable } from '@nestjs/common';
import { CreatePost } from '@property/dto/facebook.create.request.dto';
import { catchError, map, Observable } from 'rxjs';
import { PostFacebook } from './dto/post.response.dto';

@Injectable()
export class FacebookClient {
    constructor(
        private readonly httpService: HttpService 
    ){}

    createPost(body: CreatePost): Observable<any> {
        const { FACEBOOK_URL, FACEBOOK_PAGE_ID, FACEBOOK_ACCESSTOKEN } = process.env;

        return this.httpService.post(
            `${FACEBOOK_URL}${FACEBOOK_PAGE_ID}/feed`,
            body,
            {
                params: {
                    access_token: FACEBOOK_ACCESSTOKEN,
                },
            }
        ).pipe(
            map((response) => response.data),
            catchError((error) => {
                throw new HttpException(
                    {
                        status: 200,
                        error: error.message,
                    },
                    error.response.status,
                );
            }),
        );
    }

    updatePost(body: CreatePost, id: string,): Observable<any> {
        const { FACEBOOK_URL, FACEBOOK_ACCESSTOKEN } = process.env;

        return this.httpService.post(
            `${FACEBOOK_URL}${id}`,
            body,
            {
                params: {
                    access_token: FACEBOOK_ACCESSTOKEN,
                },
            }
        ).pipe(
            map((response) => response.data),
            catchError((error) => {
                throw new HttpException(
                    {
                        status: 200,
                        error: error.message,
                    },
                    error.response.status,
                );
            }),
        );
    }

    renewAccessTokenUser(): Observable<any> {
        const { FACEBOOK_URL, FACEBOOK_APP_ID, FACEBOOK_APP_SECRET, FACEBOOK_USER_ACCESSTOKEN } = process.env;
    
        return this.httpService
          .get(`${FACEBOOK_URL}oauth/access_token`, {
            params: {
              grant_type: 'fb_exchange_token',
              client_id: FACEBOOK_APP_ID,
              client_secret: FACEBOOK_APP_SECRET,
              fb_exchange_token: FACEBOOK_USER_ACCESSTOKEN,
            },
          })
          .pipe(
            map((response) => response.data),
            catchError((error) => {
              throw new HttpException(
                {
                  status: 200,
                  error: error?.message,
                },
                error?.response?.status,
              );
            }),
          );
      }

    renewAccessTokenPage(): Observable<any> {
        const { FACEBOOK_URL, FACEBOOK_USER_ACCESSTOKEN } = process.env;
    
        return this.httpService
          .get(`${FACEBOOK_URL}me/accounts`, {
            params: {
              access_token: FACEBOOK_USER_ACCESSTOKEN,
            },
          })
          .pipe(
            map((response) => response.data),
            catchError((error) => {
              throw new HttpException(
                {
                  status: 200,
                  error: error.message,
                },
                error.response.status,
              );
            }),
          );
      }

      getPost(): Observable<PostFacebook[]> {
        const { FACEBOOK_URL, FACEBOOK_PAGE_ID, FACEBOOK_ACCESSTOKEN } = process.env;
    
        return this.httpService
          .get(`${FACEBOOK_URL}${FACEBOOK_PAGE_ID}/feed`, {
            params: {
              access_token: FACEBOOK_ACCESSTOKEN,
            },
          })
          .pipe(
            map((response) => response?.data?.data),
            catchError((error) => {
              throw new HttpException(
                {
                  status: 200,
                  error: error.message,
                },
                error.response.status,
              );
            }),
          );
      }
}
