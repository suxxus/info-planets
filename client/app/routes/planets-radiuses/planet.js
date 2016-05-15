import Ember from 'ember';
export default Ember.Route.extend({
    model(value) {
        return this.store.findRecord('planet', value.name.toLowerCase());
    }
});