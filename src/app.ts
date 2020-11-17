import express, {Application} from 'express';
import morgan from 'morgan';
import upload from 'express-fileupload';

// Route
import IndexRouter from './routes/index.route';
import CategoryRouter from './routes/category.route';
import ItemRouter from './routes/item.route';
import ProductRouter from './routes/product.route';
import UserRouter from './routes/user.route';
import LoginRoute from './routes/auth/login.route';
import UserAddressRoute from './routes/user.address.route';
import OrderRoute from './routes/order.route';
import userOrderRoute from './routes/user.order.route';
import OrderDetail from './routes/order.detail.route';


export class App{
    private app: Application;

    constructor( private port?: number | string){
        this.app = express();
        this.settings();
        this.middleware();
        this.routes();
    }

    // Settings 
    settings(){
        this.app.set('port', this.port || process.env.PORT || 3000);
    }

    // Middleware
    middleware(){
        this.app.use(morgan('dev'));
        this.app.use( express.json() );       // Allows to receive form data in json format
        this.app.use( upload({
            createParentPath: true,
            limits: {
                fileSize: 2 * 1024 * 1024 * 1024        //2MB max
            }
        }) );            //Upload file
    }

    // Routes
    routes(){
        // Welcome
        this.app.use('/api', IndexRouter);
            //http://localhost:3000/api/

        // Show Images
        this.app.use(express.static('uploads'));
            //http://localhost:3000/image.png

        // Auth
        this.app.use('/auth', LoginRoute);
            //http://localhost:3000/auth/sigin/
                //post       Public
            //http://localhost:3000/auth/login/
                //post       Public
            //http://localhost:3000/auth/profile/
                //get        Public

        // API (get, post, put, delete)
        this.app.use('/api/categories', CategoryRouter);
            //http://localhost:3000/api/categories/
                //get        Public
                //post       Only admin user
                //put        Only admin user
                //delete     Only admin user
            //http://localhost:3000/api/categories/:categoryId/items/
                //get        Public

        this.app.use('/api/items', ItemRouter);
            //http://localhost:3000/api/items/
                //get        Public
                //post       Only admin user
                //put        Only admin user
                //delete     Only admin user
            //http://localhost:3000/api/items/:itemId/products/
                //get        Public

        this.app.use('/api/products', ProductRouter);
            //http://localhost:3000/api/products/
                //get        Public
                //post       Only admin user
                //put        Only admin user
                //delete     Only admin user

        this.app.use('/api/users', UserRouter);
            //http://localhost:3000/api/users/
                //get        Only admin user
                //put        Any user can enter as long as they update their own data
                //delete     Only admin user

        this.app.use('/api/users', userOrderRoute);
            //http://localhost:3000/api/users/:userId/orders/
                //get        Only owner user
                //post       Only owner user

        this.app.use('/api/users', UserAddressRoute)
            //http://localhost:3000/api/users/:userId/addresses/
                //get        Only owner user
                //post       Only owner user
            //http://localhost:3000/api/users/:userId/addresses/:addressId
                //get        Only owner user
                //put        Only owner user
                //delete     Only owner user

        this.app.use('/api/orders', OrderRoute);
            //http://localhost:3000/api/orders/
                //get        Only admin user

        this.app.use('/api/orders', OrderDetail);
            //http://localhost:3000/api/orders/:orderId/details
                //get        Only owner user
                //post        Only owner user
            //http://localhost:3000/api/orders/:orderId/details/:detailId
                //put        Only owner user
                //delete     Only owner user
    }

    // Listening 
    async listen(){
        await this.app.listen(this.app.get('port'));
        console.log('Server on Port', this.app.get('port'));
    }

}