import http from 'k6/http';
import { sleep } from 'k6';

export const options = {
  iterations: 10,
};

const url = 'https://quickpizza.grafana.com';

export default function () {
	
  http.get(url);
  sleep(1);
  
  let login = {"username":"default","password":"12345678"};
  let res = http.post(url+'/api/users/token/login', JSON.stringify(login), {
    headers: { 'Content-Type': 'application/json' },
  });
  
  console.log(res.json());
  let token = res.json().token;
  console.log(token);
  
  let data = {"maxCaloriesPerSlice":1000,"mustBeVegetarian":false,"excludedIngredients":[],"excludedTools":[],"maxNumberOfToppings":5,"minNumberOfToppings":2,"customName":""};
  let res2 = http.post(url+'/api/pizza', JSON.stringify(data), {
    headers: { 'Content-Type': 'application/json',
	'Cookie':'qp_user_token='+token},
  }); 
  
  let pid = res2.json().pizza.id;
  console.log(pid);
  
  let update = {"pizza_id": pid,"stars":5}
  
  let res3 = http.post(url+'/api/ratings', JSON.stringify(update), {
    headers: { 'Content-Type': 'application/json',
	'Cookie':'qp_user_token='+token},
  });
  
}
