<?php

namespace Database\Seeders;

use App\Models\Property;
use App\Models\PropertyType;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class DatabaseSeeder extends Seeder
{
    private function attachPropertyImages(Property $property, array $imageUrls): void
    {
        foreach ($imageUrls as $index => $imageUrl) {
            $property->images()->updateOrCreate(
                ['sort_order' => $index],
                ['path' => $imageUrl]
            );
        }
    }

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $samplePropertyImages = [
            'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80',
            'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=80',
            'https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=1200&q=80',
        ];

        $propertyImageSets = [
            'panorama-nha-trang' => [
                'https://images.unsplash.com/photo-1460317442991-0ec209397118?auto=format&fit=crop&w=1200&q=80',
                'https://images.unsplash.com/photo-1501183638710-841dd1904471?auto=format&fit=crop&w=1200&q=80',
                'https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=1200&q=80',
            ],
            'gold-coast-nha-trang' => [
                'https://images.unsplash.com/photo-1448630360428-65456885c650?auto=format&fit=crop&w=1200&q=80',
                'https://images.unsplash.com/photo-1523217582562-09d0def993a6?auto=format&fit=crop&w=1200&q=80',
                'https://images.unsplash.com/photo-1570129477492-45c003edd2be?auto=format&fit=crop&w=1200&q=80',
            ],
            'scenia-bay-nha-trang' => [
                'https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=1200&q=80',
                'https://images.unsplash.com/photo-1502672023488-70e25813eb80?auto=format&fit=crop&w=1200&q=80',
                'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
            ],
            'the-costa-nha-trang' => [
                'https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=1200&q=80',
                'https://images.unsplash.com/photo-1568605114967-8130f3a36994?auto=format&fit=crop&w=1200&q=80',
                'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80',
            ],
            'the-aston-luxury-residence-nha-trang' => [
                'https://images.unsplash.com/photo-1554995207-c18c203602cb?auto=format&fit=crop&w=1200&q=80',
                'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=80',
                'https://images.unsplash.com/photo-1430285561322-7808604715df?auto=format&fit=crop&w=1200&q=80',
            ],
            'libera-nha-trang' => [
                'https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?auto=format&fit=crop&w=1200&q=80',
                'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=80',
                'https://images.unsplash.com/photo-1502672023488-70e25813eb80?auto=format&fit=crop&w=1200&q=80',
            ],
            'ariyana-smartcondotel-nha-trang' => [
                'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=1200&q=80',
                'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80',
                'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1200&q=80',
            ],
            'khu-do-thi-vcn-phuoc-long' => [
                'https://images.unsplash.com/photo-1600607687640-aac4c3eac7f4?auto=format&fit=crop&w=1200&q=80',
                'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80',
                'https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=1200&q=80',
            ],
            'khu-do-thi-my-gia-nha-trang' => [
                'https://images.unsplash.com/photo-1600573472597-ff6d18d4b7d0?auto=format&fit=crop&w=1200&q=80',
                'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=80',
                'https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=1200&q=80',
            ],
            'khu-do-thi-le-hong-phong-2' => [
                'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1200&q=80',
                'https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=1200&q=80',
                'https://images.unsplash.com/photo-1604014237800-1c9102c219da?auto=format&fit=crop&w=1200&q=80',
            ],
        ];

        // 1. Seed Default Admin & Customer
        $admin = User::firstOrCreate(
            ['email' => 'admin@realestate3d.vn'],
            [
                'name' => 'System Admin',
                'password' => Hash::make('admin123'),
                'phone' => '0901234567',
                'role' => 'admin',
            ]
        );

        $customer = User::firstOrCreate(
            ['email' => 'customer@gmail.com'],
            [
                'name' => 'Nguyễn Văn A',
                'password' => Hash::make('password123'),
                'phone' => '0912345678',
                'role' => 'customer',
            ]
        );

        // 2. Seed Property Types
        $types = [
            ['name' => 'Căn hộ chung cư', 'slug' => 'can-ho-chung-cu'],
            ['name' => 'Nhà phố liền kề', 'slug' => 'nha-pho-lien-ke'],
            ['name' => 'Biệt thự nghỉ dưỡng', 'slug' => 'biet-thu-nghi-duong'],
            ['name' => 'Đất nền dự án', 'slug' => 'dat-nen-du-an'],
            ['name' => 'Penthouse cao cấp', 'slug' => 'penthouse-cao-cap'],
            ['name' => 'Dự án căn hộ', 'slug' => 'du-an-can-ho'],
            ['name' => 'Dự án khu đô thị', 'slug' => 'du-an-khu-do-thi'],
        ];

        foreach ($types as $typeData) {
            PropertyType::firstOrCreate(['slug' => $typeData['slug']], $typeData);
        }

        $apartmentType = PropertyType::where('slug', 'can-ho-chung-cu')->first();
        $villaType = PropertyType::where('slug', 'biet-thu-nghi-duong')->first();
        $projectApartmentType = PropertyType::where('slug', 'du-an-can-ho')->firstOrFail();
        $urbanProjectType = PropertyType::where('slug', 'du-an-khu-do-thi')->firstOrFail();

        // 3. Seed Sample Demo Properties
        if ($apartmentType) {
            $sample1 = Property::firstOrCreate(
                ['slug' => 'can-ho-cao-cap-the-metropole-thu-thiem'],
                [
                    'title' => 'Căn hộ cao cấp The Metropole Thủ Thiêm 3 Phòng Ngủ',
                    'description' => 'Căn hộ cao cấp view trực diện sông Sài Gòn, trang bị nội thất thông minh, hỗ trợ trải nghiệm 3D thực tế ảo.',
                    'type_id' => $apartmentType->id,
                    'price' => 12500000000,
                    'area_m2' => 115.5,
                    'bedrooms' => 3,
                    'bathrooms' => 2,
                    'address' => 'Khu đô thị mới Thủ Thiêm, An Khánh',
                    'city' => 'TP. Hồ Chí Minh',
                    'district' => 'Thành phố Thủ Đức',
                    'lat' => 10.7712,
                    'lng' => 106.7118,
                    'status' => 'published',
                    'created_by' => $admin->id,
                ]
            );

            // Add sample 3D model info
            $sampleModel = $sample1->models()->firstOrCreate(
                ['kind' => 'interior'],
                [
                    'file_path' => 'models/sample_apartment.glb',
                    'file_size' => 12450000,
                    'camera_json' => [
                        'position' => [0, 2, 5],
                        'target' => [0, 1, 0],
                        'fov' => 50,
                    ],
                    'scale' => 1.0,
                    'rotation_json' => [0, 0, 0],
                ]
            );

            // Sample Hotspots
            $sampleModel->hotspots()->firstOrCreate(
                ['label' => 'Phòng khách thông tầng'],
                [
                    'content' => 'Diện tích 45m2 với kính Low-E cản nhiệt, tầm nhìn ôm trọn sông.',
                    'x' => 1.2,
                    'y' => 1.5,
                    'z' => -2.0,
                ]
            );

            $sampleModel->hotspots()->firstOrCreate(
                ['label' => 'Bếp đảo Hafele'],
                [
                    'content' => 'Hệ tủ bếp Hafele nhập khẩu Đức kèm mặt đá cẩm thạch tự nhiên.',
                    'x' => -2.5,
                    'y' => 1.2,
                    'z' => 1.0,
                ]
            );

            $this->attachPropertyImages($sample1, $samplePropertyImages);
        }

        $projects = [
            [
                'slug' => 'panorama-nha-trang',
                'title' => 'Panorama Nha Trang',
                'type' => $projectApartmentType,
                'address' => 'Khu vực đường Nguyễn Thị Minh Khai, trung tâm Nha Trang',
                'description' => 'Panorama Nha Trang là tổ hợp căn hộ du lịch tại khu vực trung tâm thành phố, thuận tiện tiếp cận các tuyến phố thương mại và bãi biển. Phù hợp khách hàng tìm hiểu nhu cầu lưu trú hoặc đầu tư nghỉ dưỡng. Giá bán và diện tích từng căn cần được xác nhận trực tiếp với đơn vị phân phối.'
            ],
            [
                'slug' => 'gold-coast-nha-trang',
                'title' => 'Gold Coast Nha Trang',
                'type' => $projectApartmentType,
                'address' => 'Khu vực đường Trần Hưng Đạo, trung tâm Nha Trang',
                'description' => 'Gold Coast Nha Trang là tổ hợp căn hộ kết hợp không gian thương mại tại khu vực trung tâm. Vị trí thuận tiện cho nhu cầu lưu trú, mua sắm và khai thác dịch vụ du lịch. Giá bán và diện tích từng sản phẩm cần được xác nhận trực tiếp với đơn vị phân phối.'
            ],
            [
                'slug' => 'scenia-bay-nha-trang',
                'title' => 'Scenia Bay Nha Trang',
                'type' => $projectApartmentType,
                'address' => 'Khu vực đường Phạm Văn Đồng, phía Bắc Nha Trang',
                'description' => 'Scenia Bay Nha Trang là dự án căn hộ du lịch tại khu vực ven biển phía Bắc thành phố, gần trục đường Phạm Văn Đồng và các điểm tham quan ven biển. Thích hợp để tìm hiểu nhu cầu nghỉ dưỡng và lưu trú. Giá bán, diện tích từng căn và tình trạng giao dịch cần được xác nhận với đơn vị phân phối.'
            ],
            [
                'slug' => 'the-costa-nha-trang',
                'title' => 'The Costa Nha Trang Residences',
                'type' => $projectApartmentType,
                'address' => 'Khu vực đường Trần Phú, trung tâm Nha Trang',
                'description' => 'The Costa Nha Trang Residences nằm trên khu vực đường Trần Phú, trung tâm thành phố, thuận tiện kết nối bãi biển và các dịch vụ đô thị. Dự án hướng đến nhu cầu căn hộ lưu trú tại khu vực du lịch. Giá bán và diện tích từng căn cần được xác nhận trực tiếp với đơn vị phân phối.'
            ],
            [
                'slug' => 'the-aston-luxury-residence-nha-trang',
                'title' => 'The Aston Luxury Residence Nha Trang',
                'type' => $projectApartmentType,
                'address' => 'Khu vực Xóm Cồn, Nha Trang',
                'description' => 'The Aston Luxury Residence tọa lạc tại khu vực Xóm Cồn, gần trung tâm Nha Trang và các tiện ích ven sông, ven biển. Đây là lựa chọn để khách hàng tìm hiểu căn hộ đô thị kết hợp lưu trú. Giá bán, diện tích và tình trạng sản phẩm cần được xác nhận với đơn vị phân phối.'
            ],
            [
                'slug' => 'libera-nha-trang',
                'title' => 'Libera Nha Trang',
                'type' => $projectApartmentType,
                'address' => 'Khu vực Bãi Tiên, phía Bắc Nha Trang',
                'description' => 'Libera Nha Trang là tổ hợp du lịch, văn hóa và giải trí tại khu vực Bãi Tiên, phía Bắc thành phố. Vị trí hướng đến trải nghiệm nghỉ dưỡng và các hoạt động dịch vụ du lịch. Thông tin chi tiết về sản phẩm, diện tích và giá bán cần được xác nhận trực tiếp với đơn vị phân phối.'
            ],
            [
                'slug' => 'ariyana-smartcondotel-nha-trang',
                'title' => 'Ariyana SmartCondotel Nha Trang',
                'type' => $projectApartmentType,
                'address' => 'Khu vực đường Trần Hưng Đạo, trung tâm Nha Trang',
                'description' => 'Ariyana SmartCondotel Nha Trang là dự án căn hộ khách sạn tại khu vực trung tâm, thuận tiện tiếp cận các tuyến phố dịch vụ và bãi biển. Dự án phù hợp khách hàng đang tìm hiểu loại hình lưu trú du lịch. Diện tích, giá bán và điều kiện khai thác cần được xác nhận với đơn vị phân phối.'
            ],
            [
                'slug' => 'khu-do-thi-vcn-phuoc-long',
                'title' => 'Khu đô thị VCN Phước Long',
                'type' => $urbanProjectType,
                'address' => 'Khu vực Phước Long, Nha Trang',
                'description' => 'Khu đô thị VCN Phước Long nằm tại khu vực Phước Long, Nha Trang, với các loại hình nhà ở và tiện ích đô thị phục vụ nhu cầu an cư. Khách hàng nên xác nhận quy hoạch, pháp lý, diện tích lô/căn và giá bán của từng sản phẩm với đơn vị phân phối trước khi giao dịch.'
            ],
            [
                'slug' => 'khu-do-thi-my-gia-nha-trang',
                'title' => 'Khu đô thị Mỹ Gia Nha Trang',
                'type' => $urbanProjectType,
                'address' => 'Khu vực Vĩnh Thái, Nha Trang',
                'description' => 'Khu đô thị Mỹ Gia Nha Trang nằm tại khu vực Vĩnh Thái, hướng đến không gian sống quy hoạch với các sản phẩm nhà ở đa dạng. Thông tin về phân khu, quy hoạch, pháp lý, diện tích và giá của từng sản phẩm cần được xác nhận trực tiếp với đơn vị phân phối.'
            ],
            [
                'slug' => 'khu-do-thi-le-hong-phong-2',
                'title' => 'Khu đô thị Lê Hồng Phong II',
                'type' => $urbanProjectType,
                'address' => 'Khu vực phía Nam Nha Trang',
                'description' => 'Khu đô thị Lê Hồng Phong II nằm tại khu vực phía Nam Nha Trang, thuận tiện kết nối các khu dân cư và tiện ích đô thị. Dự án hướng đến nhu cầu nhà ở tại khu vực đang phát triển. Khách hàng cần xác nhận phân khu, pháp lý, diện tích và giá bán từng sản phẩm với đơn vị phân phối.'
            ],
        ];

        foreach ($projects as $project) {
            $property = Property::firstOrCreate(
                ['slug' => $project['slug']],
                [
                    'title' => $project['title'],
                    'description' => $project['description'],
                    'type_id' => $project['type']->id,
                    'price' => null,
                    'area_m2' => null,
                    'bedrooms' => 0,
                    'bathrooms' => 0,
                    'address' => $project['address'],
                    'city' => 'Nha Trang, Khánh Hòa',
                    'status' => 'published',
                    'created_by' => $admin->id,
                ]
            );

            // Refresh project descriptions so existing seeded records receive the latest details.
            if ($property->description !== $project['description']) {
                $property->update(['description' => $project['description']]);
            }

            $this->attachPropertyImages($property, $propertyImageSets[$project['slug']] ?? $samplePropertyImages);
        }
    }
}
