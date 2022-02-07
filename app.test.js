const config = require(`./config.json`);
const axios = require('axios');

jest.setTimeout(30000);
beforeAll(async () => {
	await page.goto(URL, {
		waitUntil: 'domcontentloaded'
	});
});

describe('Verify API request', () => {
	test('API response body contains expected payment data', async () => {
		await axios
			.get(`https://staging.api.scalapay.com/v2/payments/${config.token}`, {
				headers: {
					Accept: "application/json",
					Authorization: "Bearer qhtfs87hjnc12kkos",
				},
			})
			.then(response => {
				expect(response.data.totalAmount.amount).toBe(113.56);
				expect(response.data.totalAmount.currency).toBe('EUR');
				expect(response.data.status).toBe('charged');
				expect(response.data.captureStatus).toBe('captured');
			}, error => {
				console.log(error);
			});
	});
});

describe('Merchant Portal login and page structure verification', () => {
	test('User navigates to login page and authenticates successfully', async () => {
		const title = await page.title();
		await expect(title).toBe('Accedi - Scalapay');
		await page.type('#email', config.un);
		await page.type('#password', config.pw);
	});

	test('Login directs user to the Sales dashboard Screen', async () => {
		await Promise.all([
			page.click('button[type=submit]'),
			page.waitForNavigation({
				waitUntil: 'networkidle2'
			})
		]);
		const title = await page.title();
		await expect(title).toBe('Sales - Scalapay');
		const bodyTitle = await page.$eval('.page-title', el => el.innerText);
		await expect(bodyTitle).toBe('Sales');
		const revenueCard = await page.$eval('.card-body > .header-title.mb-3', el => el.innerText);
		await expect(revenueCard).toBe('REVENUE (K)');
	});

	test('Navigate to first order in the order table', async () => {
		const tableOrderNum = await page.$eval('tr:nth-of-type(1) > td:nth-of-type(1) > a > b', el => el.innerText);
		await page.click('tr:nth-of-type(1) > td:nth-of-type(1) > a');
		await page.waitForSelector('.d-md-block.d-none.mt-4 > .clearfix > .float-right > .d-print-none.m-0', {
			visible: true
		});
		const orderNum = await page.$eval('.d-md-block.d-none.mt-4 > .clearfix > .float-right > .d-print-none.m-0', el => el.innerText);
		await expect(orderNum).toBe(tableOrderNum);
	})

	test('Log out of Merchant Portal', async () => {
		await page.click('li:nth-of-type(3) > a');
		await page.waitForSelector('.font-weight-bold.mt-0.text-center.text-dark-50', {
			visible: true
		});
		const title = await page.title();
		await expect(title).toBe('Log in - Scalapay');
	});
});