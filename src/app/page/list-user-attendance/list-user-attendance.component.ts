import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user/users.service';
import { MembershipService } from 'app/services/membership/membership.service';
import { DatePipe } from '@angular/common';
import * as alertify from 'alertify.js';
import { ExporterService } from 'app/services/export-excel/exporter.service';
import { FormGroup, FormControl } from '@angular/forms';




@Component({
  selector: 'app-list-user-attendance',
  templateUrl: './list-user-attendance.component.html',
  styleUrls: ['./list-user-attendance.component.css']
})
export class ListUserAttendanceComponent implements OnInit {
  today = new Date();
  pipe = new DatePipe('en-US');
  todayWithPipe = null;
  Fecha = this.pipe.transform(Date.now(), 'dd/MM/yyyy')
  dataUserSystem: any = [];
  asistenciaUser = [];
  listUserCentroTrabajo = [];
  listExcel:any = [];
  disabled: boolean = true;
  dataUser;

  constructor(private user_data: MembershipService, private exportService: ExporterService) { }

  ngOnInit(): void {
    this.dataUser = JSON.parse(localStorage.getItem('infoUser'));
    this.user_data.getMembership().subscribe((data: any[]) => {
      this.dataUserSystem = data;
      if (this.dataUser.roles === "Super Admin") {
        this.dataUserSystem = data;
      } else {
        for (let index = 0; index < this.dataUserSystem.length; index++) {
          const elementInfo = this.dataUserSystem[index]
          const element = this.dataUserSystem[index].proyectos;
          if (element === this.dataUser.proyectos) {
            this.listUserCentroTrabajo.push(elementInfo)
            
          }
        }
        this.dataUserSystem = this.listUserCentroTrabajo;
      }
    })

  }

  attendanceUser(id, asistenciasUser) {
    this.asistenciaUser.push(this.dataUserSystem[0].asistencia)
    const asist = this.asistenciaUser[0]

    const prueba = {
      "fecha": this.Fecha,
      "asistencia": "Si"
    }

    asist.push(prueba)
    const attendenceUser = {
      asistencia:
        asist
    }
    this.user_data.putAttendanceUser(id, attendenceUser).subscribe((data: any) => {
      console.log(data);
      // alertify.success('Asistencia generada con exito.');
      alertify.alert('Asistencia generada con exito.', function () { alertify.error('Ok'); });

    })
  }

  exportAsXLSX() {
    this.exportService.exportToExcel(this.dataUserSystem, 'info_afiliados');
  }

  generateNomina() {
    const DiasLaborados = 15;
    const valorSubsidio = 117.172;
    const HoraExtraDiurna = 0.25;
    const TrabajoNocturno = 0.35;

    for (let index = 0; index < this.dataUserSystem.length; index++) {
      // const element = this.dataUserSystem[index];

      const SalarioDebengado = (this.dataUserSystem[index].salario / 30) * DiasLaborados;

      const subsidioTransporte = (Number(valorSubsidio) / 30) * DiasLaborados
      const DescuentoPension = (Number(SalarioDebengado)) * 0.04
      const DescuentoSalud = (Number(SalarioDebengado)) * 0.04

      console.log("SalarioDebengado", Number(SalarioDebengado));
      console.log("subsidioTransporte", Number(subsidioTransporte));
      console.log("DescuentoPension", Number(DescuentoPension));
      console.log("DescuentoSalud", Number(DescuentoSalud));

      const SubTotal = (Number(SalarioDebengado) + 58586)
      console.log("SubTotal", Math.round(SubTotal));

      const Descuentos = (Number(DescuentoSalud) + Number(DescuentoPension))
      console.log("Descuentos", Number(Descuentos));

      const TotalSalario = Number(SubTotal) - Number(Descuentos)

      console.log("SALARIO", Number(TotalSalario));

      const objetcListExcelNomina = {
        "Nombre y Apellidos": this.dataUserSystem[index].nombre + this.dataUserSystem[index].apellido,
        "Cedula": this.dataUserSystem[index].cedula,
        "Cargo": this.dataUserSystem[index].cargo,
        "Salario": Number(this.dataUserSystem[index].salario),
        "Dias Laborados": Number(DiasLaborados),
        "Salario Debengao": Number(SalarioDebengado),
        "Subsidio Transporte": Number(subsidioTransporte),

        "Descuento Pension": Number(DescuentoPension),
        "Descuento Salud":Number(DescuentoSalud),
        "Total Salario": Number(TotalSalario)

      }

        this.listExcel.push(objetcListExcelNomina);

      // alertify.alert(`Nomina de ${user[index].nombre} ${user.apellido} generada con exito. Valor a PAGAR : $ ${TotalSalario}`, function () { alertify.error('Ok'); });
      // console.log(`Nomina de ${this.dataUserSystem[index].nombre} ${this.dataUserSystem[index].apellido} generada con exito. Valor a PAGAR : $ ${TotalSalario}`);
    }
    console.log(`Nomina -------`, this.listExcel);
    this.exportService.exportToExcel(this.listExcel, `Nomina del mes `);





  }

}
