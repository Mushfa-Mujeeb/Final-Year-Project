// SELECT u.employee_id FROM ritzy.user as u ;
// //this query gives an output of employee_id in the User table which comes as a foriegn key

// SELECT e.id, e.emp_first_name FROM ritzy.employee as e;
// //this query gives an output of employee id and the respective firstname of the employee from employee table

// SELECT e.id, e.emp_first_name FROM ritzy.employee as e where e.id not in (SELECT u.employee_id FROM ritzy.user as u);
// //  "SELECT e from Employee e WHERE e.id not in (select u.employee_id from User u)" this is the way the the above query written in Dao file
// //this is a combination of above two queries which give an output of employee who has no user account


// SELECT r.reservaton_no FROM ritzy.reservation as r where r.rental_end_date = current_date() + interval - 1 day; 
// //query for not return

// SELECT r.reservaton_no FROM ritzy.reservation as r where r.rental_start_date = current_date() + interval - 1 day; 
// //query for not collected or to be collected 

// SELECT r.reservaton_no , c.first_name , c.phone, rhd.rental_end_date FROM ritzy.reservation_has_dress as rhd ,  ritzy.reservation as r , ritzy.customer as c where 
// r.id=rhd.reservation_id and r.customer_id=c.id and 
// rhd.rental_end_date between current_date() + interval - 10 day and current_date() and rhd.rental_status != 'Dress Returend';

// SELECT b.batch_name FROM nanasala.batch as b where b.end_date = curdate() + interval -2 day;

// SELECT invoice_no,total_deposit_amount FROM ritzy.invioce;

// SELECT r.invoice_no,r.total_amount FROM ritzy.invioce as r where r.invoice_type_id=1 or r.invoice_type_id =2 ;

// SELECT sum(r.total_amount) FROM ritzy.invioce as r where r.invoice_type_id=1 or r.invoice_type_id =2 ;