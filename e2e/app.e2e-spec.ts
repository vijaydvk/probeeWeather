import { WeatherApplicationPage } from './app.po';

describe('weather-application App', function() {
  let page: WeatherApplicationPage;

  beforeEach(() => {
    page = new WeatherApplicationPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
