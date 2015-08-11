window.spyOnAll = function (values, methodName) {
  values.forEach(function (value) {
    spyOn(value, methodName);
  });
};
