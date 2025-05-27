import {
  afterNextRender,
  Component,
  effect,
  ElementRef,
  HostListener,
  inject,
  input,
  output,
  signal,
  viewChild,
  viewChildren,
} from '@angular/core';

@Component({
  selector: 'img-select',
  imports: [],
  templateUrl: './img-select.component.html',
  styleUrl: './img-select.component.scss',
})
export class ImgSelectComponent {
  items = input.required<any[]>();
  bindValue = input.required<string>();
  bindLabel = input.required<string>();
  bindSrc = input.required<string>();
  // itemSelected: any;
  initIndex = input.required<string>();

  private buttonRef = viewChild<ElementRef<HTMLButtonElement>>('buttonRef');
  private liItems = viewChildren<ElementRef<HTMLLIElement>>('liItems');

  itemSelected: any;

  itemLabel: string[] = [];
  itemSrc: string[] = [];
  btnImgSrc = 0;

  buttonLabel: string = 'toto';
  /**
   * @param {string} initIndex - The initial index of the selected item.
   */
  selected = output<any>();
  dropdownOpen = signal(false);

  // pour être conforme à l'ARIA (pas obligatoire)
  // https://www.w3.org/TR/wai-aria-practices-1.1/#combobox
  activeDescendantId = signal<string>(''); // mis à jour à chaque fois qu'un élément est sélectionné

  private elementRef = inject(ElementRef);

  // constructor(private elementRef: ElementRef) {
  constructor() {
    effect(() => {
      this.itemLabel = this.items().map((item) => item[this.bindLabel()]);
      const srcProperties = this.bindSrc().split('.');
      this.itemSrc = this.items().map((item) => {
        let src = item;
        for (const prop of srcProperties) {
          src = src[prop];
        }
        return src;
      });

      const itemFnd = this.findItem();
      this.itemSelected = itemFnd;
      if (itemFnd) {
        this.buttonLabel = itemFnd[this.bindLabel()];
        let src = itemFnd;
        for (const prop of srcProperties) {
          src = src[prop];
        }
        this.btnImgSrc = src;
      }

      // Mettre le focus sur le bouton
      // si le dropdown est ouvert
      if (this.dropdownOpen()) {
        // attendre un micro-tick Angular
        queueMicrotask(() => {
          const liSelected = this.liItems().find((li) =>
            li.nativeElement.classList.contains('selected'),
          );
          if (liSelected) {
            liSelected.nativeElement.scrollIntoView({ block: 'center' });
            liSelected.nativeElement.focus();
          }
        });
      }
    });

    // Pour mettre la liste en bas du bouton
    // quelque soit la taille du bouton
    afterNextRender(() => {
      const hostEl = this.elementRef.nativeElement as HTMLElement;

      const listContainerClass = hostEl.querySelector(
        '.list-container',
      ) as HTMLElement;

      if (listContainerClass) {
        // const styles = getComputedStyle(hostEl);
        const height = hostEl.offsetHeight;

        console.log('ImgSelectComponent, height', height);
        listContainerClass.style.top = `${height}px`;
      }
    });
  }

  @HostListener('click', ['$event'])
  handleClick(event: Event) {
    // event.stopPropagation();
    this.toggleDropdown();
  }

  findItem() {
    return this.items().find(
      (item) => item[this.bindValue()] === this.initIndex(),
    );
  }

  toggleDropdown() {
    this.dropdownOpen.set(!this.dropdownOpen());
  }

  selectItem(item: any) {
    this.itemSelected = item;
    this.buttonLabel = item[this.bindLabel()];
    this.dropdownOpen.set(true);
    this.selected.emit(item);
    this.buttonRef()?.nativeElement.focus();
  }

  handleButtonKeydown(event: KeyboardEvent) {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      if (this.dropdownOpen()) {
        this.closeDropdown();
        return;
      } else this.toggleDropdown();
    }

    console.log('handleButtonKeydown', event.key);

    // On met le focus sur l’élément sélectionné (ou le premier)
    queueMicrotask(() => {
      const selected = this.liItems().find((li) =>
        li.nativeElement.classList.contains('selected'),
      );
      const target = selected ?? this.liItems()[0];
      target.nativeElement.focus();
    });
  }

  handleArrow(event: Event, index: number, delta: number) {
    event.preventDefault();
    const items = this.liItems();
    const newIndex = (index + delta + items.length) % items.length;
    items[newIndex].nativeElement.focus();
    this.activeDescendantId.set('option' + newIndex);
  }

  closeDropdown() {
    this.dropdownOpen.set(false);
    this.buttonRef()?.nativeElement.focus();
  }

  @HostListener('document:click', ['$event'])
  clickOuside(event: Event) {
    if (!this.elementRef.nativeElement.contains(event?.target)) {
      this.dropdownOpen.set(false);
    }
  }
}
