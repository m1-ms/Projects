Restaurant project - Postman collections (backend regression tests)

1. Start Oracle, Redis and the Spring Boot application.
2. Import the collections into Postman and run each one with the Collection Runner,
   or run all of them at once:  npm install -g newman   then   run-all.cmd
3. Every collection logs in as the admin account (adminuser) and creates its own test data
   with a random suffix, so it can be re-run. Auth, Order, Admin and Cache leave a few
   test users/orders behind (there is no delete-user or delete-order API); see the cleanup SQL
   that was given with each step.
