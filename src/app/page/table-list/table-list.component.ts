import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ModalInfoMembershipComponent } from 'app/modals/modal-info-membership/modal-info-membership.component';
import { ExporterService } from 'app/services/export-excel/exporter.service';
import { MembershipService } from 'app/services/membership/membership.service';


@Component({
  selector: 'app-table-list',
  templateUrl: './table-list.component.html',
  styleUrls: ['./table-list.component.css']
})
export class TableListComponent implements OnInit {

  dataUserMembership: any = [];
  dataUser;
  listAdmin = [];
  listResident = [];

  constructor(public membershipService: MembershipService, public dialog: MatDialog,public exportService: ExporterService) { }

  ngOnInit() {
    this.dataUser = JSON.parse(localStorage.getItem('infoUser'));

    if (this.dataUser.roles === "Super Admin") {
      this.getMembership();
    } else {
      this.projectsFindId();
    }
  }

  Projects() {
    this.membershipService.getMembership().subscribe(data => {
      // this.dataContratc = data;
      console.log("ACA ADMIN", data);
    })
  }

  projectsFindId() {
    if (this.dataUser.proyectos !== '') {
      this.membershipService.getMembership().subscribe(

        (data) => {
          this.dataUserMembership = data;
          for (let index = 0; index < this.dataUserMembership.length; index++) {
            const elementInfo = this.dataUserMembership[index]
            const element = this.dataUserMembership[index].proyectos;
            if (element === this.dataUser.proyectos) {
              this.listAdmin.push(elementInfo)
            }
          }
          this.dataUserMembership = this.listAdmin;
          console.log("LISTA 1", this.dataUserMembership);
        })
      }

  }

  getMembership() {
    this.membershipService.getMembership().subscribe((data: any) => { this.listResident = data; this.dataUserMembership = this.listResident; console.log("LISTA ", this.dataUserMembership);
     })
  }

  openDialog(cedula) {

    const dialogRef = this.dialog.open(ModalInfoMembershipComponent, {
      width: '1200px',
      data: { cedula }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result----: ${result}`);
      if (result) {
        this.getMembership();
      }
    });
  }

  exportAsXLSX(){
    this.exportService.exportToExcel(this.dataUserMembership, 'info_afiliados');
  }

}