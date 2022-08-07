export function RouterParamsDecorator(): (constructor) => void {
  return function (constructor) {
    const onInit = constructor.prototype.ngOnInit;
    const onDestroy = constructor.prototype.ngOnDestroy;
    constructor.prototype.ngOnInit = function () {
      constructor.activatedRoute?.queryParams.subscribe((params) => {
        if (Object.keys(params).length) {
          for (const key in params) {
            if (params[key] !== constructor.filterService.filters[key].toString()) {
              constructor.filterService.applyFilter(key, params[key]);
            }
          }
        }
      });
      // eslint-disable-next-line prefer-rest-params
      onInit.apply(this, arguments);
    };

    constructor.prototype.ngOnDestroy = function () {
      const urlTree = this.router.parseUrl(this.router.url);
      let urlWithoutParams = '/';
      if (Object.keys(urlTree.root.children).length !== 0) {
        urlWithoutParams = urlTree.root.children?.primary.segments.map((it) => it.path).join('/');
      }
      void this.router.navigate([urlWithoutParams], {
        queryParams: [],
      });

      // eslint-disable-next-line prefer-rest-params
      onDestroy.apply(this, arguments);
    };
  };
}
