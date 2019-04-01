export default new class HomepageComponent {
  constructor() {
    var lazyLoadInstance = new LazyLoad({
      elements_selector: '.section--image'
      // ... more custom settings?
    })
  }
}()
