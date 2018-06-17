const alfy = require('alfy');
const { format } = require('date-fns');
const got = require('got');
const FormData = require('form-data');

const ORDER_EMAIL = 'dieter@moeriki.com';

const ORDER_NUMBER = '28163';

const URL_PROD_QUERY =
  'https://tracker.onewheel.com/include/production_query.php';

async function requestStatus(email, orderNumber) {
  const data = new FormData();
  data.append('email', email);
  data.append('order_number', orderNumber);
  const response = await got.post(URL_PROD_QUERY, { body: data });
  const body = JSON.parse(response.body);
  if (body.status !== 'success') {
    throw new Error(`Onewheel tracker error: ${body.error_message}`);
  }
  return {
    orderStatus: body.order_status,
    shipDate: new Date(body.ship_date),
  };
}

(async () => {
  const { orderStatus, shipDate } = await requestStatus(
    ORDER_EMAIL,
    ORDER_NUMBER,
  );
  alfy.output([
    {
      arg: shipDate.toISOString(),
      title: `Status: ${orderStatus}`,
      subtitle: `Shipping: ${format(shipDate, 'MMMM Do')}`,
    },
  ]);
})();
