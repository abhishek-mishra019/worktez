/*********************************************************** 
* Copyright (C) 2022 
* Worktez 
* Author: Simran Nigam <nigamsimran14@gmail.com>
* This program is free software; you can redistribute it and/or 
* modify it under the terms of the MIT License 
* 
* 
* This program is distributed in the hope that it will be useful, 
* but WITHOUT ANY WARRANTY; without even the implied warranty of 
* MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. 
* See the MIT License for more details. 
***********************************************************/
import { Component, Input, OnInit, Output, ViewChild , EventEmitter } from '@angular/core';
import { AngularFireFunctions } from '@angular/fire/compat/functions';
import { NgForm, UntypedFormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { Label ,Team} from 'src/app/Interface/TeamInterface';
import { AuthService } from 'src/app/services/auth/auth.service';
import { BackendService } from 'src/app/services/backend/backend.service';
import { ErrorHandlerService } from 'src/app/services/error-handler/error-handler.service';
import { TeamServiceService } from 'src/app/services/team/team-service.service';


@Component({
  selector: 'app-edit-label-prop',
  templateUrl: './edit-label-prop.component.html',
  styleUrls: ['./edit-label-prop.component.css']
})
export class EditLabelPropComponent implements OnInit {
  componentName: string = "EDIT-LABEL-PROP";

  @ViewChild('form') form: NgForm;
  @Input('labelName') labelName: string;
  @Input('team') team: Team;
  @Input('scope') scope: string;
  @Input('prevLabelsArray') prevLabelsArray: string[]
  @Output() editLabelCompleted = new EventEmitter<{ completed: boolean, updatedLabelsArray: string[] }>();
  @Output() getTeamLabelsByScope = new EventEmitter();
  label: Label
  iconName = new UntypedFormControl();
  colorCode = new UntypedFormControl();
  enableLoader: boolean = false;
  showClose: boolean=false;

  updatedLabelsArray: string[] 

  constructor(private fuctions:AngularFireFunctions, private authService: AuthService, public errorHandlerService: ErrorHandlerService, private backendService: BackendService, private teamService: TeamServiceService) { }

  ngOnInit(): void {
    this.label = this.teamService.teamsLabelsJson[this.team.TeamId][this.scope][this.labelName];
    this.updatedLabelsArray = this.prevLabelsArray;
  }

    submit(){
    this.enableLoader=true;
    const orgDomain = this.backendService.getOrganizationDomain();
    const callable = this.fuctions.httpsCallable('teams/editLabel');
     callable({DisplayName: this.label.DisplayName, Status: this.label.Status, ColorCode: this.label.ColorCode, IconName: this.label.IconName, Id: this.label.Id, TeamName: this.team.TeamName, TeamId: this.team.TeamId, OrgDomain: orgDomain, Scope: this.label.Scope}).subscribe({
      next: (data) => {
        this.updatedLabelsArray = data.labelsArray;
        this.enableLoader=false;
        this.showClose=true;
      },
      error: (error) => {
        this.errorHandlerService.showError = true;
        this.errorHandlerService.getErrorCode(this.componentName, "InternalError","Api");
        this.enableLoader = false;
        console.error(error);
      },
      complete: () => {
        this.teamService.teamsLabelsJson[this.team.TeamId][this.scope][this.label.DisplayName] = this.label;
        console.info('Successful ');
      }
    });
  }

  selectedIconName(item){
    if(item.selected == false){
      this.iconName.setValue("");
      this.editLabelDone();
    } else {
      this.iconName.setValue(item.data);
    }
  }

  selectedColorName(item) {
    if(item.selected == false){
      this.colorCode.setValue("");
      this.editLabelDone();
    }else {
      var temp = item.data as string
      temp = temp.slice(1);
      this.colorCode.setValue(temp);
    }
  }

  editLabelDone(){
    this.editLabelCompleted.emit({ completed:true, updatedLabelsArray: this.updatedLabelsArray });
  }

  backToLabelDetails() {
    window.location.reload();
  }

}
