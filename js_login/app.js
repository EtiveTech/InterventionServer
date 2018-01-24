window.Policultura = Ember.Application.create();

Policultura.ApplicationRoute = Ember.Route.extend({
  model: function() {
    return Ember.$.getJSON('http://localhost/policultura_amministrativo/user2json.php?request=json&key=12345').then(function(data) {
      return data.splice(0, 1); //limito a un risultato
    });
  }
});
