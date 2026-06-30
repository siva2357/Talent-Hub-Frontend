import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ClientListComponent } from './client-list.component';
import { AdminService } from '../../../../../core/services/admin.service';
import { of } from 'rxjs';

describe('ClientListComponent', () => {
  let component: ClientListComponent;
  let fixture: ComponentFixture<ClientListComponent>;
  let mockAdminService: any;

  beforeEach(async () => {
    mockAdminService = {
      getClients: jasmine.createSpy('getClients').and.returnValue(of([
        { id: '1', clientName: 'Client 1', name: 'John', email: 'john@c.com', status: 'Active', projectsCount: 2, spent: 100 },
        { id: '2', clientName: 'Client 2', name: 'Jane', email: 'jane@c.com', status: 'Suspended', projectsCount: 0, spent: 0 }
      ])),
      updateClientStatus: jasmine.createSpy('updateClientStatus').and.returnValue(of(null))
    };

    await TestBed.configureTestingModule({
      imports: [ClientListComponent],
      providers: [
        { provide: AdminService, useValue: mockAdminService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ClientListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load clients on init', () => {
    expect(mockAdminService.getClients).toHaveBeenCalled();
    expect(component.clients().length).toBe(2);
  });

  it('should filter clients by search term', () => {
    component.searchTerm.set('John');
    expect(component.filteredClients().length).toBe(1);
    expect(component.filteredClients()[0].clientName).toBe('Client 1');
  });

  it('should filter clients by status', () => {
    component.statusFilter.set('Suspended');
    expect(component.filteredClients().length).toBe(1);
    expect(component.filteredClients()[0].clientName).toBe('Client 2');
  });
});
