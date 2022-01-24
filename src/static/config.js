const config = {
    /* webPage's Routes */
    webRoot:   'https://rinku.herokuapp.com',
    //apiUrl:    'https://rinku.herokuapp.com',
    apiUrl:    'https://rinku-back.herokuapp.com',
    /* Api's Routes */
    get_Employee: '/employee/',
    get_Employee_all: '/employee/all',
    post_Employee: '/register/employee',
    put_employee: '/update/employee/',
    delete_Employee: '/delete/employee/',
    get_Movements: '/movement/',
    get_Movements_all: '/movement/all',
    post_Movements: '/register/movement',
    put_Movements: '/update/movement/',
    delete_Movements: '/delete/movement/',
    get_sueldo: '/nomina/'
  };
  
  export default config;