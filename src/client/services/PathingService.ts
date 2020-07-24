export class PathingService {
    private constructor() { }
    public get() {
        //if an instance has not been made yet, create one
        if (instance == null) {
            instance = new PathingService();
        }
        //as long as we have an instance, return it
        return instance;
    }
}
let instance: PathingService = null;