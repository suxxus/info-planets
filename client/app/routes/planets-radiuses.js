import Ember from 'ember';
export default Ember.Route.extend({

    model() {
        this.store.findAll('planet-radiuses');
        return this.store.peekAll('planet-radiu');
    },
    
    actions: {
        clickHandler(val) {
            this.transitionTo('planets-radiuses.planet', val.planet);
        }
    }
});
