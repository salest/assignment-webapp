const requests = require('./index-requests');

beforeAll(async () => {
    await requests.clearFirestore();
    await requests.loadInitialData();
  });

test('Searching コンビニマート 日本橋室町三井タワー店 yields 1 result', async () => {
    const params = {
        storeName: 'コンビニマート 日本橋室町三井タワー店'
    };
    const data = await requests.getRequestTest(params, false);
    expect(data.length).toBe(1);
});

test('Searching コンビニマート 日本橋室町三井タワー店 with date range 2023-01-21 to 2023-02-04 yields 4 result', async () => {
    const params = {
        storeName: 'コンビニマート 東京国際フォーラム店',
        startDate: '2023-01-21',
        endDate: '2023-02-04'
    }
    const data = await requests.getRequestTest(params, true);
    expect(data.length).toBe(4);
});

test('Update ticket from 50 maintenane to 75', async () => {

    const params = {
        ticketLink: 'https://telexistence.slack.com/archives/C02G5QTSP5H/p1664239630955079',
        updatedMaintenance: 75
    }
    const data = await requests.patchRequestTest(params);
    expect(data).toBe('Data updated successfully');
});