import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { Menu, Submenu } from "../../../../core/interfaces/menu";
import { FlatTreeControl } from "@angular/cdk/tree";
import { MatTreeFlatDataSource, MatTreeFlattener } from "@angular/material/tree";
import { SelectionModel } from "@angular/cdk/collections";
import { ItemFlatNode } from "../../../../core/classes/item-flat-node";
import { ItemNode } from "../../../../core/classes/item.node";
import { SyncNavigation } from "../../interfaces/sync-navigation";
import { NavigationService } from "../../../../core/services/navigation.service";
import { NavigationData } from "../../interfaces/navigation-data";
import { ToastrService } from "ngx-toastr";

@Component({
  selector: 'app-assign-permision',
  templateUrl: './assign-permision.component.html',
  styles: []
})
export class AssignPermisionComponent implements OnInit {
  flatNodeMap = new Map<ItemFlatNode<Menu|Submenu>, ItemNode<Menu|Submenu>>();
  nestedNodeMap = new Map<ItemNode<Menu|Submenu>, ItemFlatNode<Menu|Submenu>>();
  treeControl: FlatTreeControl<ItemFlatNode<Menu|Submenu>>;

  treeFlattener: MatTreeFlattener<ItemNode<Menu|Submenu>, ItemFlatNode<Menu|Submenu>>;

  dataSource: MatTreeFlatDataSource<ItemNode<Menu|Submenu>, ItemFlatNode<Menu|Submenu>>;
  checklistSelection = new SelectionModel<ItemFlatNode<Menu|Submenu>>(true);

  constructor(
    private navigationService: NavigationService,
    private toastrService: ToastrService,
    private dialogRef: MatDialogRef<AssignPermisionComponent>,
    @Inject(MAT_DIALOG_DATA) public data: NavigationData
  ) {
    this.initialize();

    this.treeFlattener = new MatTreeFlattener(
      this.transformer,
      this.getLevel,
      this.isExpandable,
      this.getChildren,
    );
    this.treeControl = new FlatTreeControl<ItemFlatNode<Menu|Submenu>>(this.getLevel, this.isExpandable);
    this.dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);

    this.dataSource.data = this.initialize();
  }

  ngOnInit(): void {
    this.previousSelected();
  }

  getLevel = (node: ItemFlatNode<Menu|Submenu>) => node.level;

  isExpandable = (node: ItemFlatNode<Menu|Submenu>) => node.expandable;

  getChildren = (node: ItemNode<Menu|Submenu>): ItemNode<Menu|Submenu>[] => node.children;

  hasChild = (_: number, _nodeData: ItemFlatNode<Menu|Submenu>) => _nodeData.expandable;

  transformer = (node: ItemNode<Menu|Submenu>, level: number) => {
    const existingNode = this.nestedNodeMap.get(node);
    const flatNode = existingNode && JSON.stringify(existingNode.item) === JSON.stringify(node.item) ? existingNode : new ItemFlatNode<Menu|Submenu>();
    flatNode.item = node.item;
    flatNode.level = level;
    flatNode.expandable = !!node.children?.length;
    this.flatNodeMap.set(flatNode, node);
    this.nestedNodeMap.set(node, flatNode);
    return flatNode;
  };

  descendantsAllSelected(node: ItemFlatNode<Menu|Submenu>): boolean {
    const descendants = this.treeControl.getDescendants(node);
    return descendants.length > 0 &&
      descendants.every(child => {
        return this.checklistSelection.isSelected(child);
      });
  }

  descendantsPartiallySelected(node: ItemFlatNode<Menu|Submenu>): boolean {
    const descendants = this.treeControl.getDescendants(node);
    const result = descendants.some(child => this.checklistSelection.isSelected(child));
    return result && !this.descendantsAllSelected(node);
  }

  todoItemSelectionToggle(node: ItemFlatNode<Menu|Submenu>): void {
    this.checklistSelection.toggle(node);
    const descendants = this.treeControl.getDescendants(node);
    this.checklistSelection.isSelected(node)
      ? this.checklistSelection.select(...descendants)
      : this.checklistSelection.deselect(...descendants);

    // Force update for the parent
    descendants.forEach(child => this.checklistSelection.isSelected(child));
    this.checkAllParentsSelection(node);
  }

  todoLeafItemSelectionToggle(node: ItemFlatNode<Menu|Submenu>): void {
    this.checklistSelection.toggle(node);
    this.checkAllParentsSelection(node);
  }

  checkAllParentsSelection(node: ItemFlatNode<Menu|Submenu>): void {
    let parent: ItemFlatNode<Menu|Submenu> | null = this.getParentNode(node);
    while (parent) {
      this.checkRootNodeSelection(parent);
      parent = this.getParentNode(parent);
    }
  }

  checkRootNodeSelection(node: ItemFlatNode<Menu|Submenu>): void {
    const nodeSelected = this.checklistSelection.isSelected(node);
    const descendants = this.treeControl.getDescendants(node);
    const descAllSelected =
      descendants.length > 0 &&
      descendants.every(child => {
        return this.checklistSelection.isSelected(child);
      });
    if (nodeSelected && !descAllSelected) {
      this.checklistSelection.deselect(node);
    } else if (!nodeSelected && descAllSelected) {
      this.checklistSelection.select(node);
    }
  }

  getParentNode(node: ItemFlatNode<Menu|Submenu>): ItemFlatNode<Menu|Submenu> | null {
    const currentLevel = this.getLevel(node);

    if (currentLevel < 1) {
      return null;
    }

    const startIndex = this.treeControl.dataNodes.indexOf(node) - 1;

    for (let i = startIndex; i >= 0; i--) {
      const currentNode = this.treeControl.dataNodes[i];

      if (this.getLevel(currentNode) < currentLevel) {
        return currentNode;
      }
    }
    return null;
  }

  getIcon(value: boolean): string {
    return (value) ? 'mat:expand_more' : 'mat:chevron_right';
  }

  save(): void {
    let menus: number[] = [];
    let submenus: number[] = [];

    this.treeControl.dataNodes.forEach(node => {
      if (this.checklistSelection.isSelected(node)) {
        if (this.instanceOfMenu(node.item)) {
          menus.push(node.item.id);
        }

        if (this.instanceOfSubmenu(node.item)) {
          submenus.push(node.item.id);
          menus.push(node.item.menuId);
        }
      }
    });

    const data: SyncNavigation = { menus: [...new Set(menus)], submenus };
    this.navigationService.syncNavigation(this.data.userId, data).subscribe(() => {
      this.toastrService.success('Datos guardados correctamente', 'Proceso exitoso');
      this.dialogRef.close();
    });
  }

  private previousSelected(): void {
    this.treeControl.dataNodes.forEach(node => {
      if (node.item.isSelected) {
        this.checklistSelection.toggle(node);
      }

      this.treeControl.expand(node)
    });
  }

  private initialize(): ItemNode<Menu|Submenu>[] {
    let data: ItemNode<Menu|Submenu>[] = [];

    this.data.menus.forEach(menu => {
      const node = new ItemNode<Menu|Submenu>();
      node.item = menu;

      if (menu.submenu.length > 0) {
        let submenus: ItemNode<Menu|Submenu>[] = [];
        menu.submenu.forEach(submenu => {
          const child = new ItemNode<Menu|Submenu>();
          child.item = submenu;

          submenus.push(child);
        });

        node.children = submenus;
      }

      data.push(node);
    });

    return data;
  }

  private instanceOfMenu(object: any): object is Menu {
    return 'submenu' in object;
  }

  private instanceOfSubmenu(object: any): object is Submenu {
    return 'menuId' in object;
  }
}
