import { HttpService } from '@nestjs/axios';
import { HttpException, Injectable } from '@nestjs/common';
import { config } from 'process';
import { catchError, map, Observable } from 'rxjs';

@Injectable()
export class MercadoLibreClient {
    constructor(
        private readonly httpService: HttpService 
    ){}
  
    getAccessToken(authorizationCode: string): Observable<any> {
        
        const { MERCADOLIBRE_APPID, MERCADOLIBRE_CLIENT_SECRET, URL_INMO, AUTH_URL_MERCADOLIBRE } = process.env;

        const config = {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
        };
        const data = {
            grant_type: 'authorization_code',
            client_id: MERCADOLIBRE_APPID,
            client_secret: MERCADOLIBRE_CLIENT_SECRET,
            code: 'TG-66eb39dc17a28b000153ec08-186646439',
            redirect_uri: URL_INMO,
        };
  
        try {

            return this.httpService.post(
                AUTH_URL_MERCADOLIBRE,
                data,
                config
            )
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
                }
                ),
            );
        } catch (error) {
            throw new HttpException(error, 500);
        }

    }
  }