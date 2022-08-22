import appConfiguration from 'app.config'

class CalculateService {
  baseUrl: string
  formData: FormData
  requestHeaders: any

  constructor() {
    this.baseUrl = `${appConfiguration.apiEndpoint}/calculate`
    this.formData = new FormData()
  }

  appendFile(file: string | ArrayBuffer) {
    this.formData.append('file', new Blob([file], { type: 'text/csv' }))
    return this
  }

  async calculate() {
    const requestHeaders = await appConfiguration.getRequestHeaders()
    const externalAcousticRatingPartial =
      '?external-acoustic-ratings[n][day]=62&external-acoustic-ratings[n][night]=55&external-acoustic-ratings[ne][day]=62&external-acoustic-ratings[ne][night]=55&external-acoustic-ratings[e][day]=0&external-acoustic-ratings[e][night]=0&external-acoustic-ratings[se][day]=0&external-acoustic-ratings[se][night]=0&external-acoustic-ratings[s][day]=0&external-acoustic-ratings[s][night]=0&external-acoustic-ratings[sw][day]=0&external-acoustic-ratings[sw][night]=0&external-acoustic-ratings[w][day]=0&external-acoustic-ratings[w][night]=0&external-acoustic-ratings[nw][day]=0&external-acoustic-ratings[nw][night]=0'

    return fetch(`${this.baseUrl}${externalAcousticRatingPartial}`, {
      method: 'POST',
      headers: requestHeaders,
      body: this.formData,
    }).then((response) => response.json())
  }
}

export default new CalculateService()
